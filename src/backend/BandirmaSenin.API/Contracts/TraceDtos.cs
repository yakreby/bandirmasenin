using BandirmaSenin.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace BandirmaSenin.API.Contracts;

/*
 * "İz bırak" sözleşmesi; frontend'de src/lib/types.ts → Trace ile birebir aynı.
 * Enum'lar snake_case: karisik, tehlikeli, pending, approved …
 */

public record TraceDto(
    Guid Id,
    double[] Coords,
    TraceKind Kind,
    string? Note,
    string PhotoUrl,
    TraceStatus Status,
    DateTime CreatedAt,
    double? AccuracyM,
    string? ReviewNote)
{
    /// <param name="forAdmin">false ise yönetici notu ve doğruluk gibi iç alanlar boş döner.</param>
    public static TraceDto From(TraceReport t, string photoUrl, bool forAdmin) => new(
        t.Id,
        new[] { t.Latitude, t.Longitude },
        t.Kind,
        t.Note,
        photoUrl,
        t.Status,
        t.CreatedAt,
        forAdmin ? t.AccuracyM : null,
        forAdmin ? t.ReviewNote : null);
}

/// <summary>multipart/form-data: photo + latitude + longitude (+ accuracy, kind, note). Anonim.</summary>
public sealed class TraceCreateForm
{
    [Required] public IFormFile? Photo { get; set; }
    /// <summary>Ondalık nokta ile (40.3521). Sunucu kültürü tr-TR olabilir; bu yüzden string alınır, invariant çözülür.</summary>
    [Required, MaxLength(32)] public string Latitude { get; set; } = string.Empty;
    [Required, MaxLength(32)] public string Longitude { get; set; } = string.Empty;
    [MaxLength(32)] public string? Accuracy { get; set; }
    public TraceKind Kind { get; set; } = TraceKind.Karisik;
    [MaxLength(300)] public string? Note { get; set; }
    /// <summary>Bal küpü. Doluysa sessizce yoksayılır.</summary>
    public string? Website { get; set; }
}

public record TraceReviewRequest(TraceStatus? Status, [MaxLength(1000)] string? ReviewNote);
