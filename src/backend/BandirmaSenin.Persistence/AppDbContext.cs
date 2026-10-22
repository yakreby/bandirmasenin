using BandirmaSenin.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BandirmaSenin.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Spot> Spots => Set<Spot>();
    public DbSet<Visit> Visits => Set<Visit>();
    public DbSet<Weighing> Weighings => Set<Weighing>();
    public DbSet<Sponsor> Sponsors => Set<Sponsor>();
    public DbSet<SpotSponsor> SpotSponsors => Set<SpotSponsor>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }

    public override Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;
        foreach (var e in ChangeTracker.Entries<Spot>())
        {
            if (e.State == EntityState.Added) e.Entity.CreatedAt = now;
            if (e.State is EntityState.Added or EntityState.Modified) e.Entity.UpdatedAt = now;
        }
        return base.SaveChangesAsync(ct);
    }
}
