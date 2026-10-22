using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using BandirmaSenin.API.Security;
using BandirmaSenin.Domain.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace BandirmaSenin.API.Controllers;

public record RegisterRequest(
    [Required, MaxLength(120)] string FullName,
    [Required, EmailAddress, MaxLength(200)] string Email,
    [Required, MinLength(8), MaxLength(100)] string Password,
    [MaxLength(40)] string? Phone,
    bool KvkkAccepted);

public record LoginRequest([Required, EmailAddress] string Email, [Required] string Password);

public record UpdateMeRequest([Required, MaxLength(120)] string FullName, [MaxLength(40)] string? Phone);

public record ChangePasswordRequest([Required] string CurrentPassword, [Required, MinLength(8), MaxLength(100)] string NewPassword);

public record UserDto(
    Guid Id, string FullName, string Email, string? Phone, string Status, string[] Roles,
    DateTime CreatedAt, DateTime? ApprovedAt, string? WhatsAppInviteUrl)
{
    public static UserDto From(AppUser u, IList<string> roles, string? whatsapp) => new(
        u.Id, u.FullName, u.Email ?? "", u.PhoneNumber, u.Status.ToString().ToLowerInvariant(), roles.ToArray(),
        u.CreatedAt, u.ApprovedAt,
        // WhatsApp daveti yalnızca onaylı üyeye
        u.Status == MembershipStatus.Approved ? whatsapp : null);
}

public record AuthResponse(string Token, DateTime ExpiresAt, UserDto User);

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<AppUser> _users;
    private readonly JwtTokenService _jwt;
    private readonly IConfiguration _cfg;
    private readonly ILogger<AuthController> _log;

    public AuthController(UserManager<AppUser> users, JwtTokenService jwt, IConfiguration cfg, ILogger<AuthController> log)
    {
        _users = users;
        _jwt = jwt;
        _cfg = cfg;
        _log = log;
    }

    private string? WhatsApp => _cfg["Community:WhatsAppInviteUrl"];

    [HttpPost("register")]
    [EnableRateLimiting("auth")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest req)
    {
        if (!req.KvkkAccepted)
            return ValidationProblem("Aydınlatma metnini kabul etmeden kayıt olunamaz.");

        var user = new AppUser
        {
            Id = Guid.NewGuid(),
            UserName = req.Email.Trim().ToLowerInvariant(),
            Email = req.Email.Trim().ToLowerInvariant(),
            FullName = req.FullName.Trim(),
            PhoneNumber = string.IsNullOrWhiteSpace(req.Phone) ? null : req.Phone.Trim(),
            Status = MembershipStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            KvkkAcceptedAt = DateTime.UtcNow,
        };

        var res = await _users.CreateAsync(user, req.Password);
        if (!res.Succeeded)
        {
            // E-posta zaten kayıtlıysa bunu söylemek hesap numaralandırmaya açık ama küçük bir topluluk sitesi için anlaşılır olmak daha önemli.
            var msg = res.Errors.Any(e => e.Code.Contains("Duplicate"))
                ? "Bu e-posta ile zaten bir hesap var. Giriş yapmayı deneyin."
                : string.Join(" ", res.Errors.Select(TranslateError));
            return ValidationProblem(msg);
        }

        await _users.AddToRoleAsync(user, AppRoles.Member);
        _log.LogInformation("Yeni kayıt: {Email}", user.Email);
        return Created("/api/auth/me", await Issue(user));
    }

    [HttpPost("login")]
    [EnableRateLimiting("auth")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest req)
    {
        var user = await _users.FindByEmailAsync(req.Email.Trim().ToLowerInvariant());
        if (user is null) return Unauthorized(Problem401("E-posta ya da şifre hatalı."));

        if (await _users.IsLockedOutAsync(user))
            return Unauthorized(Problem401("Çok fazla hatalı deneme. 15 dakika sonra tekrar deneyin."));

        if (!await _users.CheckPasswordAsync(user, req.Password))
        {
            await _users.AccessFailedAsync(user);
            return Unauthorized(Problem401("E-posta ya da şifre hatalı."));
        }

        await _users.ResetAccessFailedCountAsync(user);
        return Ok(await Issue(user));
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserDto>> Me()
    {
        var user = await Current();
        if (user is null) return Unauthorized();
        return UserDto.From(user, await _users.GetRolesAsync(user), WhatsApp);
    }

    [HttpPut("me")]
    [Authorize]
    public async Task<ActionResult<UserDto>> UpdateMe([FromBody] UpdateMeRequest req)
    {
        var user = await Current();
        if (user is null) return Unauthorized();
        user.FullName = req.FullName.Trim();
        user.PhoneNumber = string.IsNullOrWhiteSpace(req.Phone) ? null : req.Phone.Trim();
        var res = await _users.UpdateAsync(user);
        if (!res.Succeeded) return ValidationProblem(string.Join(" ", res.Errors.Select(TranslateError)));
        return UserDto.From(user, await _users.GetRolesAsync(user), WhatsApp);
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest req)
    {
        var user = await Current();
        if (user is null) return Unauthorized();
        var res = await _users.ChangePasswordAsync(user, req.CurrentPassword, req.NewPassword);
        if (!res.Succeeded) return ValidationProblem(string.Join(" ", res.Errors.Select(TranslateError)));
        return NoContent();
    }

    private async Task<AppUser?> Current()
    {
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(id, out var guid)) return null;
        var user = await _users.FindByIdAsync(guid.ToString());
        // Şifre değiştiyse eski anahtar düşsün.
        if (user is null || user.SecurityStamp != User.FindFirstValue("sstamp")) return null;
        return user;
    }

    private async Task<AuthResponse> Issue(AppUser user)
    {
        var roles = await _users.GetRolesAsync(user);
        var (token, exp) = _jwt.Create(user, roles);
        return new AuthResponse(token, exp, UserDto.From(user, roles, WhatsApp));
    }

    private ProblemDetails Problem401(string detail) => new()
    {
        Status = 401, Title = "Giriş başarısız", Detail = detail, Instance = Request.Path,
    };

    private static string TranslateError(IdentityError e) => e.Code switch
    {
        "PasswordTooShort" => "Şifre en az 8 karakter olmalı.",
        "PasswordMismatch" => "Mevcut şifre hatalı.",
        "InvalidEmail" => "E-posta adresi geçersiz.",
        _ => e.Description,
    };
}
