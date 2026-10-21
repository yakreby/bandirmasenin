using BandirmaSenin.Persistence;
using Microsoft.AspNetCore.Mvc;

namespace BandirmaSenin.API.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    private readonly AppDbContext _db;

    public HealthController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken ct)
    {
        var dbOk = await _db.Database.CanConnectAsync(ct);
        var body = new { status = dbOk ? "ok" : "degraded", db = dbOk, utc = DateTime.UtcNow };
        return dbOk ? Ok(body) : StatusCode(503, body);
    }
}
