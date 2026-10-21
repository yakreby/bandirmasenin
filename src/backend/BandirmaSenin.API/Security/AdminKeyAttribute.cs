using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace BandirmaSenin.API.Security;

/// <summary>
/// Yazma uçları için basit anahtar denetimi: <c>X-Admin-Key</c> başlığı <c>Admin:ApiKey</c> ayarıyla eşleşmeli.
/// Ayar boşsa yazma uçları tamamen kapalıdır. Yönetici paneli geldiğinde gerçek kimlik doğrulamayla değişir.
/// </summary>
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
public sealed class AdminKeyAttribute : Attribute, IAsyncAuthorizationFilter
{
    public Task OnAuthorizationAsync(AuthorizationFilterContext ctx)
    {
        var expected = ctx.HttpContext.RequestServices.GetRequiredService<IConfiguration>()["Admin:ApiKey"];
        if (string.IsNullOrWhiteSpace(expected))
        {
            ctx.Result = Problem(ctx, 403, "Yazma uçları kapalı", "Admin:ApiKey tanımlı değil.");
            return Task.CompletedTask;
        }

        var given = ctx.HttpContext.Request.Headers["X-Admin-Key"].ToString();
        var a = Encoding.UTF8.GetBytes(given);
        var b = Encoding.UTF8.GetBytes(expected);
        if (a.Length != b.Length || !CryptographicOperations.FixedTimeEquals(a, b))
        {
            ctx.Result = Problem(ctx, 401, "Yetkisiz", "X-Admin-Key başlığı eksik ya da hatalı.");
        }
        return Task.CompletedTask;
    }

    private static ObjectResult Problem(AuthorizationFilterContext ctx, int status, string title, string detail) =>
        new(new ProblemDetails
        {
            Status = status,
            Title = title,
            Detail = detail,
            Instance = ctx.HttpContext.Request.Path,
        })
        { StatusCode = status };
}
