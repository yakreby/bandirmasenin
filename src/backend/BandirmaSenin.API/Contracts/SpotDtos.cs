using System.ComponentModel.DataAnnotations;
using BandirmaSenin.Domain.Entities;

namespace BandirmaSenin.API.Contracts;

/*
 * JSON sözleşmesi frontend'deki src/lib/types.ts ile birebir aynıdır.
 * Enum'lar snake_case yazılır (tespit_edildi, yeniden_kontrol_edilecek …), bkz. Program.cs.
 */

public record WeighingDto(Material Material, decimal Kg, WeighMethod Method);

public record PhotosDto(string? Before, string? After);

public record VisitDto(
    DateOnly Date,
    VisitKind Kind,
    int Volunteers,
    string? Team,
    PhotosDto? Photos,
    List<WeighingDto>? Weighings,
    string? DeliveredTo,
    string? Notes);

public record RecheckDto(DateOnly Date, RecheckResult Result, string? Note, string? Photo);

public record SpotDto(
    string Slug,
    string Title,
    string City,
    string District,
    SpotKind Kind,
    double[] Coords,
    SpotStatus Status,
    string Summary,
    string? AdoptedBy,
    string[] SponsorIds,
    DateOnly? RecheckDue,
    RecheckDto? Recheck,
    List<VisitDto> Visits,
    bool Demo)
{
    public static SpotDto From(Spot s) => new(
        s.Slug, s.Title, s.City, s.District, s.Kind,
        new[] { s.Latitude, s.Longitude },
        s.Status, s.Summary, s.AdoptedBy,
        s.Sponsors.Select(x => x.Sponsor.Key).ToArray(),
        s.RecheckDue,
        s.Recheck is null ? null : new RecheckDto(s.Recheck.Date, s.Recheck.Result, s.Recheck.Note, s.Recheck.Photo),
        s.Visits.OrderBy(v => v.Date).ThenBy(v => v.Order).Select(v => new VisitDto(
            v.Date, v.Kind, v.Volunteers, v.Team,
            v.PhotoBefore is null && v.PhotoAfter is null ? null : new PhotosDto(v.PhotoBefore, v.PhotoAfter),
            v.Weighings.Count == 0 ? null : v.Weighings.Select(w => new WeighingDto(w.Material, w.Kg, w.Method)).ToList(),
            v.DeliveredTo, v.Notes)).ToList(),
        s.IsDemo);
}

/// <summary>Yönetici yazma ucu: nokta bütün olarak gönderilir, slug'a göre oluşturulur ya da üzerine yazılır.</summary>
public record SpotUpsertRequest(
    [Required, RegularExpression("^[a-z0-9-]{3,120}$")] string Slug,
    [Required, MaxLength(200)] string Title,
    [MaxLength(60)] string? City,
    [Required, MaxLength(120)] string District,
    SpotKind Kind,
    [Required, MinLength(2), MaxLength(2)] double[] Coords,
    SpotStatus Status,
    [Required, MaxLength(2000)] string Summary,
    [MaxLength(200)] string? AdoptedBy,
    string[]? SponsorIds,
    DateOnly? RecheckDue,
    RecheckDto? Recheck,
    List<VisitDto>? Visits,
    bool Demo);

public record SponsorDto(string Id, string Name, string? Url, string? Contribution)
{
    public static SponsorDto From(Sponsor s) => new(s.Key, s.Name, s.Url, s.Contribution);
}

public record SponsorUpsertRequest(
    [Required, RegularExpression("^[a-z0-9-]{2,60}$")] string Id,
    [Required, MaxLength(200)] string Name,
    [MaxLength(300)] string? Url,
    [MaxLength(500)] string? Contribution,
    bool IsActive = true,
    int Order = 0);
