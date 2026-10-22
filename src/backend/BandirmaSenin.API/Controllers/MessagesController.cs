using BandirmaSenin.API.Security;
using BandirmaSenin.Domain.Entities;
using BandirmaSenin.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace BandirmaSenin.API.Controllers;

public record ContactRequest(
    ContactKind Kind,
    [Required, MaxLength(120)] string Name,
    [Required, EmailAddress, MaxLength(200)] string Email,
    [MaxLength(40)] string? Phone,
    [Required, MinLength(10), MaxLength(4000)] string Message,
    double? Latitude,
    double? Longitude,
    /// <summary>Bal küpü: gerçek kullanıcı görmez, botlar doldurur. Doluysa sessizce yoksayılır.</summary>
    string? Website);

public record ContactMessageDto(
    Guid Id, ContactKind Kind, string Name, string Email, string? Phone, string Message,
    double? Latitude, double? Longitude, bool IsRead, string? Note, DateTime CreatedAt)
{
    public static ContactMessageDto From(ContactMessage m) => new(
        m.Id, m.Kind, m.Name, m.Email, m.Phone, m.Message, m.Latitude, m.Longitude, m.IsRead, m.Note, m.CreatedAt);
}

public record MessagePatchRequest(bool? IsRead, [MaxLength(2000)] string? Note);

[ApiController]
[Route("api/messages")]
public class MessagesController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ILogger<MessagesController> _log;

    public MessagesController(AppDbContext db, ILogger<MessagesController> log)
    {
        _db = db;
        _log = log;
    }

    /// <summary>İletişim formu. Herkese açık; IP başına sınırlı (bkz. Program.cs "contact" politikası).</summary>
    [HttpPost]
    [EnableRateLimiting("contact")]
    public async Task<IActionResult> Create([FromBody] ContactRequest req, CancellationToken ct)
    {
        if (!string.IsNullOrWhiteSpace(req.Website))
        {
            _log.LogInformation("Bal küpü dolu, mesaj yoksayıldı.");
            return Accepted(); // bota başarı gibi görünür, kayıt yok
        }

        if (req.Latitude is not null ^ req.Longitude is not null)
            return ValidationProblem("Konum için enlem ve boylam birlikte verilmeli.");

        var m = new ContactMessage
        {
            Id = Guid.NewGuid(),
            Kind = req.Kind,
            Name = req.Name.Trim(),
            Email = req.Email.Trim(),
            Phone = string.IsNullOrWhiteSpace(req.Phone) ? null : req.Phone.Trim(),
            Message = req.Message.Trim(),
            Latitude = req.Latitude,
            Longitude = req.Longitude,
            Ip = HttpContext.Connection.RemoteIpAddress?.ToString(),
            CreatedAt = DateTime.UtcNow,
        };
        _db.ContactMessages.Add(m);
        await _db.SaveChangesAsync(ct);
        return Accepted(new { id = m.Id });
    }

    /// <summary>Yönetici: mesaj listesi, en yeni üstte. ?unread=true yalnız okunmamışlar.</summary>
    [HttpGet]
    [AdminKey]
    public async Task<ActionResult<List<ContactMessageDto>>> List([FromQuery] bool unread = false, [FromQuery] int take = 100, CancellationToken ct = default)
    {
        var q = _db.ContactMessages.AsNoTracking();
        if (unread) q = q.Where(m => !m.IsRead);
        var list = await q.OrderByDescending(m => m.CreatedAt).Take(Math.Clamp(take, 1, 500)).ToListAsync(ct);
        return list.Select(ContactMessageDto.From).ToList();
    }

    [HttpPatch("{id:guid}")]
    [AdminKey]
    public async Task<ActionResult<ContactMessageDto>> Patch(Guid id, [FromBody] MessagePatchRequest req, CancellationToken ct)
    {
        var m = await _db.ContactMessages.FindAsync(new object[] { id }, ct);
        if (m is null) return NotFound();
        if (req.IsRead is not null) m.IsRead = req.IsRead.Value;
        if (req.Note is not null) m.Note = req.Note;
        await _db.SaveChangesAsync(ct);
        return ContactMessageDto.From(m);
    }

    [HttpDelete("{id:guid}")]
    [AdminKey]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var n = await _db.ContactMessages.Where(m => m.Id == id).ExecuteDeleteAsync(ct);
        return n == 0 ? NotFound() : NoContent();
    }
}
