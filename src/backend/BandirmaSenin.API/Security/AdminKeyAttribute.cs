using System.Security.Cryptography;
using System.Text;
using BandirmaSenin.Domain.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace BandirmaSenin.API.Security;

/// <summary>
/// Yazma uçları için yetki: ya giriş yapmış bir <c>Admin</c> kullanıcı (JWT), ya da <c>X-Admin-Key</c>
/// başlığı <c>Admin:ApiKey</c> ayarıyla eşleşir (betikler, Swagger). Anahtar boşsa yalnız Admin rolü geçer.
/// </summary>
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
public sealed class AdminKeyAttribute : Attribute, IAsyncAuthorizationFilter
{
    public Task OnAuthorizationAsync(AuthorizationFilterContext ctx)
    {
        var user = ctx.HttpContext.User;
        if (user.Identity?.IsAuthenticated == true && user.IsInRole(AppRoles.Admin))
            return Task.CompletedTask;

        var expected = ctx.HttpContext.RequestServices.GetRequiredService<IConfiguration>()["Admin:ApiKey"];
        var given = ctx.HttpContext.Request.Headers["X-Admin-Key"].ToString();
        if (!string.IsNullOrWhiteSpace(expected) && !string.IsNullOrEmpty(given))
        {
            var a = Encoding.UTF8.GetBytes(given);
            var b = Encoding.UTF8.GetBytes(expected);
            if (a.Length == b.Length && CryptographicOperations.FixedTimeEquals(a, b))
                return Task.CompletedTask;
        }

        var status = user.Identity?.IsAuthenticated == true ? 403 : 401;
        ctx.Result = new ObjectResult(new ProblemDetails
        {
            Status = status,
            Title = status == 403 ? "Yetki yok" : "Giriş gerekli",
            Detail = status == 403 ? "Bu işlem için yönetici yetkisi gerekir." : "Yönetici girişi ya da X-Admin-Key başlığı gerekir.",
            Instance = ctx.HttpContext.Request.Path,
        })
        { StatusCode = status };
        return Task.CompletedTask;
    }
}
