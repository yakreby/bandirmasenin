using BandirmaSenin.API.Contracts;
using BandirmaSenin.API.Security;
using BandirmaSenin.Domain.Entities;
using BandirmaSenin.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BandirmaSenin.API.Controllers;

[ApiController]
[Route("api/sponsors")]
public class SponsorsController : ControllerBase
{
    private readonly AppDbContext _db;

    public SponsorsController(AppDbContext db) => _db = db;

    [HttpGet]
    [ResponseCache(Duration = 300, Location = ResponseCacheLocation.Any)]
    public async Task<ActionResult<List<SponsorDto>>> List(CancellationToken ct)
    {
        var list = await _db.Sponsors.AsNoTracking()
            .Where(s => s.IsActive)
            .OrderBy(s => s.Order).ThenBy(s => s.Name)
            .ToListAsync(ct);
        return list.Select(SponsorDto.From).ToList();
    }

    [HttpPut("{id}")]
    [AdminKey]
    public async Task<ActionResult<SponsorDto>> Upsert(string id, [FromBody] SponsorUpsertRequest req, CancellationToken ct)
    {
        if (!string.Equals(id, req.Id, StringComparison.Ordinal))
            return ValidationProblem("Yoldaki id ile gövdedeki id aynı olmalı.");

        var s = await _db.Sponsors.FirstOrDefaultAsync(x => x.Key == id, ct);
        var created = s is null;
        if (s is null)
        {
            s = new Sponsor { Id = Guid.NewGuid(), Key = id };
            _db.Sponsors.Add(s);
        }
        s.Name = req.Name;
        s.Url = req.Url;
        s.Contribution = req.Contribution;
        s.IsActive = req.IsActive;
        s.Order = req.Order;
        await _db.SaveChangesAsync(ct);

        var dto = SponsorDto.From(s);
        return created ? CreatedAtAction(nameof(List), null, dto) : Ok(dto);
    }
}
