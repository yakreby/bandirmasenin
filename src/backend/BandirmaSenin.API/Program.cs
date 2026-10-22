using System.Text;
using BandirmaSenin.API.Middleware;
using BandirmaSenin.API.Security;
using BandirmaSenin.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using System.IO.Compression;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// Sırlar: appsettings.{Env}.local.json en son yüklenir ve her şeyi ezer (repoya girmez).
builder.Configuration.AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.local.json", optional: true, reloadOnChange: true);

builder.Services.AddPersistence(builder.Configuration);

// Kimlik: JWT bearer. Frontend (Next) anahtarı HttpOnly çerezde tutar ve isteklere Bearer olarak ekler.
var jwt = builder.Configuration.GetSection(JwtOptions.Section).Get<JwtOptions>() ?? new JwtOptions();
if (string.IsNullOrWhiteSpace(jwt.Key) || jwt.Key.Length < 32)
    throw new InvalidOperationException("Jwt:Key en az 32 karakter olmalı (appsettings.*.local.json).");
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.Section));
builder.Services.AddSingleton<JwtTokenService>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(o =>
{
    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwt.Issuer,
        ValidateAudience = true,
        ValidAudience = jwt.Audience,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key)),
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromMinutes(1),
    };
});
builder.Services.AddAuthorization();

builder.Services.AddControllers().AddJsonOptions(o =>
{
    // Enum'lar frontend sözleşmesiyle aynı: tespit_edildi, yeniden_kontrol_edilecek, tarti …
    o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.SnakeCaseLower));
    o.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

builder.Services.Configure<ApiBehaviorOptions>(o =>
{
    o.InvalidModelStateResponseFactory = ctx => new BadRequestObjectResult(new ValidationProblemDetails(ctx.ModelState)
    {
        Title = "Doğrulama hatası",
        Instance = ctx.HttpContext.Request.Path,
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddResponseCompression(o =>
{
    o.EnableForHttps = true;
    o.Providers.Add<BrotliCompressionProvider>();
    o.Providers.Add<GzipCompressionProvider>();
});
builder.Services.Configure<BrotliCompressionProviderOptions>(o => o.Level = CompressionLevel.Fastest);
builder.Services.Configure<GzipCompressionProviderOptions>(o => o.Level = CompressionLevel.Fastest);
builder.Services.AddResponseCaching();

var origins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>() ?? Array.Empty<string>();
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins(origins).AllowAnyHeader().WithMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")));

// İletişim formu: IP başına 10 dakikada 5 mesaj. Proxy arkasında X-Forwarded-For için ForwardedHeaders gerekir.
builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    o.AddPolicy("contact", ctx => RateLimitPartition.GetFixedWindowLimiter(
        ctx.Connection.RemoteIpAddress?.ToString() ?? "anon",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = 5, Window = TimeSpan.FromMinutes(10), QueueLimit = 0 }));
    // Kayıt ve giriş: IP başına 10 dakikada 10 deneme (kaba kuvvete karşı; hesap kilidi ayrıca var).
    o.AddPolicy("auth", ctx => RateLimitPartition.GetFixedWindowLimiter(
        ctx.Connection.RemoteIpAddress?.ToString() ?? "anon",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = 10, Window = TimeSpan.FromMinutes(10), QueueLimit = 0 }));
});
builder.Services.Configure<ForwardedHeadersOptions>(o =>
{
    o.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    o.KnownNetworks.Clear();
    o.KnownProxies.Clear();
});

var app = builder.Build();

app.UseForwardedHeaders();
app.UseMiddleware<ErrorHandlerMiddleware>();

// Eşleşmeyen yollar ve yetki hataları da ProblemDetails döner (404/401/403 …).
app.UseStatusCodePages(async ctx =>
{
    var res = ctx.HttpContext.Response;
    if (res.HasStarted || res.ContentLength > 0) return;
    res.ContentType = "application/problem+json";
    var title = res.StatusCode switch
    {
        404 => "Bulunamadı",
        401 => "Yetkisiz",
        403 => "Erişim yok",
        405 => "Yöntem desteklenmiyor",
        _ => "Hata",
    };
    await res.WriteAsJsonAsync(new ProblemDetails
    {
        Status = res.StatusCode,
        Title = title,
        Instance = ctx.HttpContext.Request.Path,
    });
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}

app.UseResponseCompression();
app.UseCors();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.UseResponseCaching();
app.MapControllers();
app.MapGet("/", () => Results.Ok(new { name = "Bandırma Senin API", health = "/api/health", spots = "/api/spots" }))
    .ExcludeFromDescription();

// Her ortamda: roller ve (ayarlıysa) ilk yönetici. Geliştirmede ayrıca migration ve örnek veri.
{
    using var scope = app.Services.CreateScope();
    var seeder = scope.ServiceProvider.GetRequiredService<DbSeeder>();
    if (app.Environment.IsDevelopment())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await db.Database.MigrateAsync();
        if (app.Configuration.GetValue<bool>("Seed:Demo"))
            await seeder.SeedDemoAsync();
    }
    await seeder.SeedIdentityAsync(
        app.Configuration["Admin:Email"],
        app.Configuration["Admin:Password"],
        app.Configuration["Admin:FullName"]);
}

app.Run();
