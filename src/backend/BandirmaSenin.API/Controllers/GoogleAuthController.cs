using System.ComponentModel.DataAnnotations;
using BandirmaSenin.API.Security;
using BandirmaSenin.Domain.Identity;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace BandirmaSenin.API.Controllers;

public record GoogleLoginRequest([Required] string IdToken);

/// <summary>
/// Google ile giriş/kayıt. Tarayıcı Google Identity Services'tan id_token alır, biz imzasını ve
/// hedef kitlesini (Google:ClientId) doğrularız. E-posta eşleşirse o hesaba girer, yoksa Pending üye açar.
/// </summary>
[ApiController]
[Route("api/auth/google")]
public class GoogleAuthController : ControllerBase
{
    private readonly UserManager<AppUser> _users;
    private readonly JwtTokenService _jwt;
    private readonly IConfiguration _cfg;
    private readonly ILogger<GoogleAuthController> _log;

    public GoogleAuthController(UserManager<AppUser> users, JwtTokenService jwt, IConfiguration cfg, ILogger<GoogleAuthController> log)
    {
        _users = users;
        _jwt = jwt;
        _cfg = cfg;
        _log = log;
    }

    [HttpPost]
    [EnableRateLimiting("auth")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] GoogleLoginRequest req)
    {
        var clientId = _cfg["Google:ClientId"];
        if (string.IsNullOrWhiteSpace(clientId))
            return NotFound(new ProblemDetails { Status = 404, Title = "Google girişi kapalı", Instance = Request.Path });

        GoogleJsonWebSignature.Payload payload;
        try
        {
            payload = await GoogleJsonWebSignature.ValidateAsync(req.IdToken,
                new GoogleJsonWebSignature.ValidationSettings { Audience = new[] { clientId } });
        }
        catch (InvalidJwtException ex)
        {
            _log.LogWarning(ex, "Geçersiz Google anahtarı");
            return Unauthorized(new ProblemDetails { Status = 401, Title = "Giriş başarısız", Detail = "Google anahtarı doğrulanamadı.", Instance = Request.Path });
        }

        if (payload.EmailVerified != true || string.IsNullOrWhiteSpace(payload.Email))
            return Unauthorized(new ProblemDetails { Status = 401, Title = "Giriş başarısız", Detail = "Google hesabının e-postası doğrulanmamış.", Instance = Request.Path });

        var email = payload.Email.Trim().ToLowerInvariant();
        var user = await _users.FindByLoginAsync("Google", payload.Subject) ?? await _users.FindByEmailAsync(email);

        if (user is null)
        {
            user = new AppUser
            {
                Id = Guid.NewGuid(),
                UserName = email,
                Email = email,
                EmailConfirmed = true,
                FullName = string.IsNullOrWhiteSpace(payload.Name) ? email : payload.Name.Trim(),
                Status = MembershipStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                KvkkAcceptedAt = DateTime.UtcNow, // düğmenin altında aydınlatma metni linki var
            };
            var res = await _users.CreateAsync(user); // şifresiz hesap; yalnız Google ile girer
            if (!res.Succeeded)
                return ValidationProblem(string.Join(" ", res.Errors.Select(e => e.Description)));
            await _users.AddToRoleAsync(user, AppRoles.Member);
            _log.LogInformation("Google ile yeni kayıt: {Email}", email);
        }

        if (await _users.FindByLoginAsync("Google", payload.Subject) is null)
            await _users.AddLoginAsync(user, new UserLoginInfo("Google", payload.Subject, "Google"));

        if (await _users.IsLockedOutAsync(user))
            return Unauthorized(new ProblemDetails { Status = 401, Title = "Giriş başarısız", Detail = "Hesap geçici olarak kilitli.", Instance = Request.Path });

        var roles = await _users.GetRolesAsync(user);
        var (token, exp) = _jwt.Create(user, roles);
        return Ok(new AuthResponse(token, exp, UserDto.From(user, roles, _cfg["Community:WhatsAppInviteUrl"])));
    }
}
