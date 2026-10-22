using BandirmaSenin.Domain.Entities;
using BandirmaSenin.Domain.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BandirmaSenin.Persistence;

/// <summary>
/// Veritabanı boşsa ve <c>Seed:Demo</c> açıksa arayüzü göstermek için 3 örnek nokta ekler.
/// Hepsi <see cref="Spot.IsDemo"/> = true; arayüzde "örnek kayıt" damgası taşır, toplamlara girmez.
/// </summary>
public class DbSeeder
{
    private readonly AppDbContext _db;
    private readonly ILogger<DbSeeder> _log;
    private readonly RoleManager<IdentityRole<Guid>> _roles;
    private readonly UserManager<AppUser> _users;

    public DbSeeder(AppDbContext db, ILogger<DbSeeder> log, RoleManager<IdentityRole<Guid>> roles, UserManager<AppUser> users)
    {
        _db = db;
        _log = log;
        _roles = roles;
        _users = users;
    }

    /// <summary>
    /// Rolleri oluşturur; <c>Admin:Email</c> + <c>Admin:Password</c> ayarlıysa ve o e-posta yoksa ilk yöneticiyi açar.
    /// Var olan kullanıcıya dokunmaz (şifreyi ezmez). Üretimde bir kez çalışması için yeterli.
    /// </summary>
    public async Task SeedIdentityAsync(string? adminEmail, string? adminPassword, string? adminName)
    {
        foreach (var role in new[] { AppRoles.Admin, AppRoles.Member })
            if (!await _roles.RoleExistsAsync(role))
                await _roles.CreateAsync(new IdentityRole<Guid> { Id = Guid.NewGuid(), Name = role });

        if (string.IsNullOrWhiteSpace(adminEmail) || string.IsNullOrWhiteSpace(adminPassword)) return;
        var email = adminEmail.Trim().ToLowerInvariant();
        if (await _users.FindByEmailAsync(email) is not null) return;

        var admin = new AppUser
        {
            Id = Guid.NewGuid(),
            UserName = email,
            Email = email,
            EmailConfirmed = true,
            FullName = string.IsNullOrWhiteSpace(adminName) ? "Yönetici" : adminName.Trim(),
            Status = MembershipStatus.Approved,
            CreatedAt = DateTime.UtcNow,
            ApprovedAt = DateTime.UtcNow,
            KvkkAcceptedAt = DateTime.UtcNow,
        };
        var res = await _users.CreateAsync(admin, adminPassword);
        if (!res.Succeeded)
        {
            _log.LogWarning("İlk yönetici oluşturulamadı: {Errors}", string.Join("; ", res.Errors.Select(e => e.Description)));
            return;
        }
        await _users.AddToRolesAsync(admin, new[] { AppRoles.Admin, AppRoles.Member });
        _log.LogInformation("İlk yönetici oluşturuldu: {Email}", email);
    }

    public async Task SeedDemoAsync(CancellationToken ct = default)
    {
        if (await _db.Spots.AnyAsync(ct))
        {
            _log.LogInformation("Seed atlandı: Spots tablosu dolu.");
            return;
        }

        var spots = new List<Spot>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Slug = "sahil-yuruyus-yolu",
                Title = "Sahil yürüyüş yolu, kayalık kıyı",
                District = "Paşakent mevkii",
                Kind = SpotKind.Sahil,
                Latitude = 40.3562, Longitude = 27.9605,
                Status = SpotStatus.YenidenKontrolEdilecek,
                Summary = "Yürüyüş yolunun denize bakan kayalık kıyısında rüzgârla birikmiş ambalaj atığı. Rüzgâr yönü nedeniyle her lodosta yeniden doluyor.",
                RecheckDue = new DateOnly(2026, 11, 22),
                IsDemo = true,
                Visits =
                {
                    new Visit
                    {
                        Id = Guid.NewGuid(), Date = new DateOnly(2026, 10, 25), Kind = VisitKind.Temizlik,
                        Volunteers = 2, Team = "Kurucu ekip",
                        PhotoBefore = "/demo/sahil-before.svg", PhotoAfter = "/demo/sahil-after.svg",
                        DeliveredTo = "Bandırma Belediyesi Temizlik İşleri (ayrıştırılmış)",
                        Notes = "Kayalık arasına sıkışmış ipler ve ağ parçaları çıkarılamadı, belediyeye bildirildi.",
                        Weighings =
                        {
                            new Weighing { Id = Guid.NewGuid(), Material = Material.Plastik, Kg = 9.4m, Method = WeighMethod.Tarti },
                            new Weighing { Id = Guid.NewGuid(), Material = Material.Cam, Kg = 3.1m, Method = WeighMethod.Tarti },
                            new Weighing { Id = Guid.NewGuid(), Material = Material.Diger, Kg = 2.0m, Method = WeighMethod.Tahmin },
                        },
                    },
                },
            },
            new()
            {
                Id = Guid.NewGuid(),
                Slug = "livatya-parki",
                Title = "Mahalle parkı, çocuk oyun alanı çevresi",
                District = "Livatya mahallesi",
                Kind = SpotKind.Park,
                Latitude = 40.3478, Longitude = 27.9688,
                Status = SpotStatus.Tamamlandi,
                Summary = "Oyun alanının arkasındaki çalılıkta birikmiş pet şişe ve ambalaj. Park içinde çöp kutusu yok, en yakını 80 metre ileride.",
                RecheckDue = new DateOnly(2026, 12, 1),
                IsDemo = true,
                Visits =
                {
                    new Visit
                    {
                        Id = Guid.NewGuid(), Date = new DateOnly(2026, 11, 1), Kind = VisitKind.Temizlik,
                        Volunteers = 4, Team = "Kurucu ekip ve 2 mahalleli",
                        PhotoBefore = "/demo/park-before.svg", PhotoAfter = "/demo/park-after.svg",
                        DeliveredTo = "Bandırma Belediyesi Temizlik İşleri (ayrıştırılmış)",
                        Notes = "Kalıcı çözüm için parka çöp kutusu konması belediyeye önerildi.",
                        Weighings =
                        {
                            new Weighing { Id = Guid.NewGuid(), Material = Material.Plastik, Kg = 5.2m, Method = WeighMethod.Tarti },
                            new Weighing { Id = Guid.NewGuid(), Material = Material.Kagit, Kg = 1.8m, Method = WeighMethod.Tarti },
                            new Weighing { Id = Guid.NewGuid(), Material = Material.Organik, Kg = 4.0m, Method = WeighMethod.Tahmin },
                        },
                    },
                },
            },
            new()
            {
                Id = Guid.NewGuid(),
                Slug = "edincik-yolu-dere-kenari",
                Title = "Dere kenarı, köprü altı",
                District = "Edincik yolu",
                Kind = SpotKind.Dere,
                Latitude = 40.3392, Longitude = 27.9876,
                Status = SpotStatus.TespitEdildi,
                Summary = "Köprü altında inşaat ve ev atığı. Yol kenarı trafiğe açık, gönüllüyle değil yetkili ekiple temizlenmeli.",
                IsDemo = true,
                Visits =
                {
                    new Visit
                    {
                        Id = Guid.NewGuid(), Date = new DateOnly(2026, 11, 8), Kind = VisitKind.Kontrol,
                        Volunteers = 1, PhotoBefore = "/demo/dere-before.svg",
                        Notes = "Yalnızca tespit ve fotoğraf. Belediyeye konum ve görsel iletildi.",
                    },
                },
            },
        };

        _db.Spots.AddRange(spots);
        await _db.SaveChangesAsync(ct);
        _log.LogInformation("Seed: {Count} örnek nokta eklendi.", spots.Count);
    }
}
