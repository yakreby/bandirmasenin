using BandirmaSenin.API.Contracts;
using BandirmaSenin.API.Security;
using BandirmaSenin.API.Storage;
using BandirmaSenin.Domain.Entities;
using BandirmaSenin.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BandirmaSenin.API.Controllers;

/// <summary>
/// "İz bırak": anonim çöp bildirimi. Fotoğraf + konum gelir, Pending düşer; yönetici onaylayınca
/// herkese açık listede ve haritada görünür. İsim/e-posta alınmaz; IP yalnız kötüye kullanım için saklanır.
/// </summary>
[ApiController]
[Route("api/traces")]
public class TracesController : ControllerBase
{
    /// <summary>Şimdilik yalnız Bandırma: bu kutunun dışındaki konumlar reddedilir (lat/lng).</summary>
    private static readonly (double MinLat, double MaxLat, double MinLng, double MaxLng) CityBox = (40.20, 40.50, 27.70, 28.20);

    private readonly AppDbContext _db;
    private readonly IPhotoStorage _storage;
    private readonly UploadsOptions _opt;
    private readonly ILogger<TracesController> _log;

    public TracesController(AppDbContext db, IPhotoStorage storage, IOptions<UploadsOptions> opt, ILogger<TracesController> log)
    {
        _db = db;
        _storage = storage;
        _opt = opt.Value;
        _log = log;
    }

    private string BaseUrl => $"{Request.Scheme}://{Request.Host}";

    private TraceDto Map(TraceReport t, bool forAdmin) => TraceDto.From(t, _storage.PublicUrl(t.PhotoPath, BaseUrl), forAdmin);

    /// <summary>Herkese açık: yalnız onaylı izler, en yeni üstte.</summary>
    [HttpGet]
    [ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]
    public async Task<ActionResult<List<TraceDto>>> ListApproved([FromQuery] int take = 300, CancellationToken ct = default)
    {
        var list = await _db.TraceReports.AsNoTracking()
            .Where(t => t.Status == TraceStatus.Approved)
            .OrderByDescending(t => t.CreatedAt)
            .Take(Math.Clamp(take, 1, 1000))
            .ToListAsync(ct);
        return list.Select(t => Map(t, forAdmin: false)).ToList();
    }

    /// <summary>Anonim bildirim. multipart/form-data. IP başına sınırlı ("trace" politikası).</summary>
    [HttpPost]
    [EnableRateLimiting("trace")]
    [RequestSizeLimit(8_000_000)]
    [RequestFormLimits(MultipartBodyLengthLimit = 8_000_000)]
    public async Task<IActionResult> Create([FromForm] TraceCreateForm form, CancellationToken ct)
    {
        if (!string.IsNullOrWhiteSpace(form.Website))
        {
            _log.LogInformation("Bal küpü dolu, iz yoksayıldı.");
            return Accepted();
        }

        if (form.Photo is null || form.Photo.Length == 0)
            return ValidationProblem("Fotoğraf gerekli.");
        if (form.Photo.Length > _opt.MaxPhotoBytes)
            return ValidationProblem($"Fotoğraf en fazla {_opt.MaxPhotoBytes / 1_000_000} MB olabilir.");

        if (!TryInvariant(form.Latitude, out var lat) || !TryInvariant(form.Longitude, out var lng)
            || lat is < -90 or > 90 || lng is < -180 or > 180)
            return ValidationProblem("Konum okunamadı. Enlem/boylam ondalık nokta ile gönderilmeli (40.3521).");
        double? accuracy = TryInvariant(form.Accuracy, out var accVal) && accVal >= 0 ? Math.Round(accVal) : null;
        if (lat < CityBox.MinLat || lat > CityBox.MaxLat || lng < CityBox.MinLng || lng > CityBox.MaxLng)
            return ValidationProblem("Şimdilik yalnız Bandırma sınırları içindeki izler kabul ediliyor.");

        string ext;
        await using (var probe = form.Photo.OpenReadStream())
        {
            var head = new byte[12];
            var n = await probe.ReadAtLeastAsync(head, 12, throwOnEndOfStream: false, ct);
            ext = SniffImage(head.AsSpan(0, n)) ?? "";
        }
        if (ext.Length == 0)
            return ValidationProblem("Yalnız JPEG, PNG ya da WebP fotoğraf kabul edilir.");

        string path;
        await using (var content = form.Photo.OpenReadStream())
            path = await _storage.SaveAsync(content, "traces", ext, ct);

        var t = new TraceReport
        {
            Id = Guid.NewGuid(),
            Latitude = lat,
            Longitude = lng,
            AccuracyM = accuracy,
            Kind = form.Kind,
            Note = string.IsNullOrWhiteSpace(form.Note) ? null : form.Note.Trim(),
            PhotoPath = path,
            Status = TraceStatus.Pending,
            Ip = HttpContext.Connection.RemoteIpAddress?.ToString(),
            CreatedAt = DateTime.UtcNow,
        };
        _db.TraceReports.Add(t);
        await _db.SaveChangesAsync(ct);
        return Accepted(new { id = t.Id });
    }

    /// <summary>Yönetici: tüm izler. ?status=pending|approved|rejected ile süzülür, en yeni üstte.</summary>
    [HttpGet("all")]
    [AdminKey]
    public async Task<ActionResult<List<TraceDto>>> ListAll([FromQuery] TraceStatus? status, [FromQuery] int take = 200, CancellationToken ct = default)
    {
        var q = _db.TraceReports.AsNoTracking();
        if (status is not null) q = q.Where(t => t.Status == status);
        var list = await q.OrderByDescending(t => t.CreatedAt).Take(Math.Clamp(take, 1, 1000)).ToListAsync(ct);
        return list.Select(t => Map(t, forAdmin: true)).ToList();
    }

    /// <summary>Yönetici: onayla / reddet / not yaz.</summary>
    [HttpPatch("{id:guid}")]
    [AdminKey]
    public async Task<ActionResult<TraceDto>> Review(Guid id, [FromBody] TraceReviewRequest req, CancellationToken ct)
    {
        var t = await _db.TraceReports.FindAsync(new object[] { id }, ct);
        if (t is null) return NotFound();
        if (req.Status is not null && req.Status != t.Status)
        {
            t.Status = req.Status.Value;
            t.ReviewedAt = DateTime.UtcNow;
        }
        if (req.ReviewNote is not null) t.ReviewNote = string.IsNullOrWhiteSpace(req.ReviewNote) ? null : req.ReviewNote.Trim();
        await _db.SaveChangesAsync(ct);
        return Map(t, forAdmin: true);
    }

    /// <summary>Yönetici: kaydı ve fotoğrafı siler (ör. kişi/plaka görünen gönderim).</summary>
    [HttpDelete("{id:guid}")]
    [AdminKey]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var t = await _db.TraceReports.FindAsync(new object[] { id }, ct);
        if (t is null) return NotFound();
        _db.TraceReports.Remove(t);
        await _db.SaveChangesAsync(ct);
        await _storage.DeleteAsync(t.PhotoPath, ct);
        return NoContent();
    }

    /// <summary>Kültürden bağımsız sayı: tr-TR'de "40.3521" model bağlayıcıda 403521 oluyordu.</summary>
    private static bool TryInvariant(string? s, out double v) =>
        double.TryParse(s?.Trim().Replace(',', '.'), System.Globalization.NumberStyles.Float, System.Globalization.CultureInfo.InvariantCulture, out v);

    /// <summary>Dosya başlığından tür: uzantıya ya da Content-Type'a güvenilmez.</summary>
    private static string? SniffImage(ReadOnlySpan<byte> h)
    {
        if (h.Length >= 3 && h[0] == 0xFF && h[1] == 0xD8 && h[2] == 0xFF) return ".jpg";
        if (h.Length >= 8 && h[0] == 0x89 && h[1] == 0x50 && h[2] == 0x4E && h[3] == 0x47 && h[4] == 0x0D && h[5] == 0x0A && h[6] == 0x1A && h[7] == 0x0A) return ".png";
        if (h.Length >= 12 && h[0] == (byte)'R' && h[1] == (byte)'I' && h[2] == (byte)'F' && h[3] == (byte)'F'
            && h[8] == (byte)'W' && h[9] == (byte)'E' && h[10] == (byte)'B' && h[11] == (byte)'P') return ".webp";
        return null;
    }
}
