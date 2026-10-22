using BandirmaSenin.API.Contracts;
using BandirmaSenin.API.Security;
using BandirmaSenin.Domain.Entities;
using BandirmaSenin.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BandirmaSenin.API.Controllers;

[ApiController]
[Route("api/spots")]
public class SpotsController : ControllerBase
{
    private readonly AppDbContext _db;

    public SpotsController(AppDbContext db) => _db = db;

    private IQueryable<Spot> Full() => _db.Spots
        .AsNoTracking()
        .Include(s => s.Visits).ThenInclude(v => v.Weighings)
        .Include(s => s.Sponsors).ThenInclude(x => x.Sponsor);

    /// <summary>Tüm noktalar. İsteğe bağlı şehir süzgeci (varsayılan: hepsi).</summary>
    [HttpGet]
    [ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]
    public async Task<ActionResult<List<SpotDto>>> List([FromQuery] string? city, CancellationToken ct)
    {
        var q = Full();
        if (!string.IsNullOrWhiteSpace(city)) q = q.Where(s => s.City == city.ToLowerInvariant());
        var spots = await q.OrderByDescending(s => s.UpdatedAt).ToListAsync(ct);
        return spots.Select(SpotDto.From).ToList();
    }

    [HttpGet("{slug}")]
    [ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]
    public async Task<ActionResult<SpotDto>> Get(string slug, CancellationToken ct)
    {
        var spot = await Full().FirstOrDefaultAsync(s => s.Slug == slug, ct);
        return spot is null ? NotFound() : SpotDto.From(spot);
    }

    /// <summary>Noktayı bütün olarak oluşturur ya da slug'a göre üzerine yazar. X-Admin-Key gerekir.</summary>
    [HttpPut("{slug}")]
    [AdminKey]
    public async Task<ActionResult<SpotDto>> Upsert(string slug, [FromBody] SpotUpsertRequest req, CancellationToken ct)
    {
        if (!string.Equals(slug, req.Slug, StringComparison.Ordinal))
            return ValidationProblem("Yoldaki slug ile gövdedeki slug aynı olmalı.");

        var sponsorKeys = (req.SponsorIds ?? Array.Empty<string>()).Distinct().ToArray();
        var sponsors = await _db.Sponsors.Where(s => sponsorKeys.Contains(s.Key)).ToListAsync(ct);
        var missing = sponsorKeys.Except(sponsors.Select(s => s.Key)).ToArray();
        if (missing.Length > 0)
            return ValidationProblem($"Tanımsız destekçi: {string.Join(", ", missing)}");

        var spot = await _db.Spots
            .Include(s => s.Visits).ThenInclude(v => v.Weighings)
            .Include(s => s.Sponsors)
            .FirstOrDefaultAsync(s => s.Slug == slug, ct);

        var created = spot is null;
        if (spot is null)
        {
            spot = new Spot { Id = Guid.NewGuid(), Slug = slug };
            _db.Spots.Add(spot);
        }

        spot.Title = req.Title;
        spot.City = (req.City ?? "bandirma").ToLowerInvariant();
        spot.District = req.District;
        spot.Kind = req.Kind;
        spot.Latitude = req.Coords[0];
        spot.Longitude = req.Coords[1];
        spot.Status = req.Status;
        spot.Summary = req.Summary;
        spot.AdoptedBy = req.AdoptedBy;
        spot.RecheckDue = req.RecheckDue;
        spot.Recheck = req.Recheck is null ? null : new Recheck
        {
            Date = req.Recheck.Date,
            Result = req.Recheck.Result,
            Note = req.Recheck.Note,
            Photo = req.Recheck.Photo,
        };
        spot.IsDemo = req.Demo;

        // Ziyaretler ve tartımlar belge gibi ele alınır: eskisi silinir, gelen yazılır.
        _db.Weighings.RemoveRange(spot.Visits.SelectMany(v => v.Weighings));
        _db.Visits.RemoveRange(spot.Visits);
        spot.Visits = (req.Visits ?? new()).Select((v, i) => new Visit
        {
            Id = Guid.NewGuid(),
            Date = v.Date,
            Kind = v.Kind,
            Volunteers = v.Volunteers,
            Team = v.Team,
            PhotoBefore = v.Photos?.Before,
            PhotoAfter = v.Photos?.After,
            DeliveredTo = v.DeliveredTo,
            Notes = v.Notes,
            Order = i,
            Weighings = (v.Weighings ?? new()).Select(w => new Weighing
            {
                Id = Guid.NewGuid(),
                Material = w.Material,
                Kg = w.Kg,
                Method = w.Method,
            }).ToList(),
        }).ToList();

        _db.SpotSponsors.RemoveRange(spot.Sponsors);
        spot.Sponsors = sponsors.Select(s => new SpotSponsor { SponsorId = s.Id, Sponsor = s }).ToList();

        await _db.SaveChangesAsync(ct);

        var dto = SpotDto.From(spot);
        return created ? CreatedAtAction(nameof(Get), new { slug }, dto) : Ok(dto);
    }

    [HttpDelete("{slug}")]
    [AdminKey]
    public async Task<IActionResult> Delete(string slug, CancellationToken ct)
    {
        var n = await _db.Spots.Where(s => s.Slug == slug).ExecuteDeleteAsync(ct);
        return n == 0 ? NotFound() : NoContent();
    }
}
