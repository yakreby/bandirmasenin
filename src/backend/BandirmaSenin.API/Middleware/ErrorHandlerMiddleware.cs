using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace BandirmaSenin.API.Middleware;

/// <summary>
/// Yakalanmamış istisnaları RFC 7807 ProblemDetails gövdesiyle döner; ayrıntı yalnızca Development'ta.
/// Hata tipine göre durum kodu: doğrulama 400, bulunamadı 404, iptal 499, kalan 500.
/// </summary>
public class ErrorHandlerMiddleware
{
    private static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web);

    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlerMiddleware> _log;
    private readonly IHostEnvironment _env;

    public ErrorHandlerMiddleware(RequestDelegate next, ILogger<ErrorHandlerMiddleware> log, IHostEnvironment env)
    {
        _next = next;
        _log = log;
        _env = env;
    }

    public async Task Invoke(HttpContext ctx)
    {
        try
        {
            await _next(ctx);
        }
        catch (OperationCanceledException) when (ctx.RequestAborted.IsCancellationRequested)
        {
            ctx.Response.StatusCode = 499;
        }
        catch (Exception ex)
        {
            var (status, title) = ex switch
            {
                ArgumentException or FormatException => (400, "Geçersiz istek"),
                KeyNotFoundException => (404, "Bulunamadı"),
                _ => (500, "Sunucu hatası"),
            };

            if (status >= 500) _log.LogError(ex, "İşlenmemiş hata: {Method} {Path}", ctx.Request.Method, ctx.Request.Path);
            else _log.LogWarning(ex, "İstek hatası: {Method} {Path}", ctx.Request.Method, ctx.Request.Path);

            if (ctx.Response.HasStarted) throw;

            ctx.Response.Clear();
            ctx.Response.StatusCode = status;
            ctx.Response.ContentType = "application/problem+json";
            var problem = new ProblemDetails
            {
                Status = status,
                Title = title,
                Detail = _env.IsDevelopment() ? ex.ToString() : (status >= 500 ? "Beklenmeyen bir hata oluştu." : ex.Message),
                Instance = ctx.Request.Path,
            };
            problem.Extensions["traceId"] = ctx.TraceIdentifier;
            await ctx.Response.WriteAsync(JsonSerializer.Serialize(problem, Json));
        }
    }
}
