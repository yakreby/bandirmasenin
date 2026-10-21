using System.IO.Compression;
using System.Text.Json;
using System.Text.Json.Serialization;
using BandirmaSenin.API.Middleware;
using BandirmaSenin.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Sırlar: appsettings.{Env}.local.json en son yüklenir ve her şeyi ezer (repoya girmez).
builder.Configuration.AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.local.json", optional: true, reloadOnChange: true);

builder.Services.AddPersistence(builder.Configuration);

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
    p.WithOrigins(origins).AllowAnyHeader().WithMethods("GET", "PUT", "DELETE", "OPTIONS")));

var app = builder.Build();

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
app.UseResponseCaching();
app.MapControllers();

// Geliştirmede migration'ı uygula ve boşsa örnek veriyi bas. Üretimde migration elle çalıştırılır.
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
    if (app.Configuration.GetValue<bool>("Seed:Demo"))
        await scope.ServiceProvider.GetRequiredService<DbSeeder>().SeedDemoAsync();
}

app.Run();
