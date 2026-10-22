using System.ComponentModel.DataAnnotations;
using BandirmaSenin.API.Security;
using BandirmaSenin.Domain.Identity;
using BandirmaSenin.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BandirmaSenin.API.Controllers;

public record AdminUserDto(
    Guid Id, string FullName, string Email, string? Phone, string Status, string[] Roles,
    DateTime CreatedAt, DateTime? ApprovedAt, string? AdminNote);

public record AdminUserPatch(
    [RegularExpression("^(pending|approved|rejected)$")] string? Status,
    [MaxLength(1000)] string? AdminNote,
    bool? IsAdmin);

[ApiController]
[Route("api/admin/users")]
[AdminKey]
public class AdminUsersController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly UserManager<AppUser> _users;

    public AdminUsersController(AppDbContext db, UserManager<AppUser> users)
    {
        _db = db;
        _users = users;
    }

    /// <summary>Üyeler. ?status=pending|approved|rejected süzer; varsayılan hepsi, en yeni üstte.</summary>
    [HttpGet]
    public async Task<ActionResult<List<AdminUserDto>>> List([FromQuery] string? status, CancellationToken ct)
    {
        var q = _db.Users.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<MembershipStatus>(status, true, out var st))
            q = q.Where(u => u.Status == st);
        var users = await q.OrderByDescending(u => u.CreatedAt).Take(500).ToListAsync(ct);

        var roleMap = await (from ur in _db.UserRoles
                             join r in _db.Roles on ur.RoleId equals r.Id
                             select new { ur.UserId, r.Name }).ToListAsync(ct);

        return users.Select(u => new AdminUserDto(
            u.Id, u.FullName, u.Email ?? "", u.PhoneNumber, u.Status.ToString().ToLowerInvariant(),
            roleMap.Where(x => x.UserId == u.Id).Select(x => x.Name!).ToArray(),
            u.CreatedAt, u.ApprovedAt, u.AdminNote)).ToList();
    }

    /// <summary>Onayla / reddet, not yaz, yönetici yap ya da yöneticiliği al.</summary>
    [HttpPatch("{id:guid}")]
    public async Task<ActionResult<AdminUserDto>> Patch(Guid id, [FromBody] AdminUserPatch req)
    {
        var user = await _users.FindByIdAsync(id.ToString());
        if (user is null) return NotFound();

        if (req.Status is not null)
        {
            var st = Enum.Parse<MembershipStatus>(req.Status, true);
            if (st == MembershipStatus.Approved && user.Status != MembershipStatus.Approved) user.ApprovedAt = DateTime.UtcNow;
            if (st != MembershipStatus.Approved) user.ApprovedAt = null;
            user.Status = st;
        }
        if (req.AdminNote is not null) user.AdminNote = req.AdminNote;

        var res = await _users.UpdateAsync(user);
        if (!res.Succeeded) return ValidationProblem(string.Join(" ", res.Errors.Select(e => e.Description)));

        if (req.IsAdmin is not null)
        {
            var isAdmin = await _users.IsInRoleAsync(user, AppRoles.Admin);
            if (req.IsAdmin.Value && !isAdmin) await _users.AddToRoleAsync(user, AppRoles.Admin);
            if (!req.IsAdmin.Value && isAdmin)
            {
                // Son yöneticiyi düşürme.
                var admins = await _users.GetUsersInRoleAsync(AppRoles.Admin);
                if (admins.Count <= 1) return ValidationProblem("Son yönetici kaldırılamaz.");
                await _users.RemoveFromRoleAsync(user, AppRoles.Admin);
            }
            // Rol değişince eski anahtarlar düşsün.
            await _users.UpdateSecurityStampAsync(user);
        }

        var roles = await _users.GetRolesAsync(user);
        return new AdminUserDto(user.Id, user.FullName, user.Email ?? "", user.PhoneNumber,
            user.Status.ToString().ToLowerInvariant(), roles.ToArray(), user.CreatedAt, user.ApprovedAt, user.AdminNote);
    }
}
