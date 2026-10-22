using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BandirmaSenin.Domain.Identity;
using Microsoft.IdentityModel.Tokens;

namespace BandirmaSenin.API.Security;

public class JwtOptions
{
    public const string Section = "Jwt";
    public string Key { get; set; } = string.Empty;
    public string Issuer { get; set; } = "bandirmasenin";
    public string Audience { get; set; } = "bandirmasenin";
    public int ExpiresDays { get; set; } = 14;
}

/// <summary>Giriş sonrası imzalı erişim anahtarı. Frontend bunu HttpOnly çereze koyar, API'ye Bearer olarak taşır.</summary>
public class JwtTokenService
{
    private readonly JwtOptions _o;

    public JwtTokenService(Microsoft.Extensions.Options.IOptions<JwtOptions> o) => _o = o.Value;

    public (string token, DateTime expiresAt) Create(AppUser user, IList<string> roles)
    {
        var expires = DateTime.UtcNow.AddDays(_o.ExpiresDays);
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.FullName),
            new("status", user.Status.ToString().ToLowerInvariant()),
            new("sstamp", user.SecurityStamp ?? string.Empty),
        };
        claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_o.Key));
        var jwt = new JwtSecurityToken(
            issuer: _o.Issuer,
            audience: _o.Audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: expires,
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));
        return (new JwtSecurityTokenHandler().WriteToken(jwt), expires);
    }
}
