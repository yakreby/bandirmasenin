using BandirmaSenin.Domain.Entities;
using BandirmaSenin.Domain.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BandirmaSenin.Persistence;

public class AppDbContext : IdentityDbContext<AppUser, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Spot> Spots => Set<Spot>();
    public DbSet<Visit> Visits => Set<Visit>();
    public DbSet<Weighing> Weighings => Set<Weighing>();
    public DbSet<Sponsor> Sponsors => Set<Sponsor>();
    public DbSet<SpotSponsor> SpotSponsors => Set<SpotSponsor>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<TraceReport> TraceReports => Set<TraceReport>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        base.OnModelCreating(b);
        b.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        // Identity tabloları sade adlarla.
        b.Entity<AppUser>(u =>
        {
            u.ToTable("Users");
            u.Property(x => x.FullName).HasMaxLength(120).IsRequired();
            u.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
            u.Property(x => x.AdminNote).HasMaxLength(1000);
            u.HasIndex(x => x.Status);
        });
        b.Entity<IdentityRole<Guid>>().ToTable("Roles");
        b.Entity<IdentityUserRole<Guid>>().ToTable("UserRoles");
        b.Entity<IdentityUserClaim<Guid>>().ToTable("UserClaims");
        b.Entity<IdentityUserLogin<Guid>>().ToTable("UserLogins");
        b.Entity<IdentityUserToken<Guid>>().ToTable("UserTokens");
        b.Entity<IdentityRoleClaim<Guid>>().ToTable("RoleClaims");
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
