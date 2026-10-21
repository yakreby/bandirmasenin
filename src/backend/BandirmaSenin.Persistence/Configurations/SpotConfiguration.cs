using BandirmaSenin.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BandirmaSenin.Persistence.Configurations;

public class SpotConfiguration : IEntityTypeConfiguration<Spot>
{
    public void Configure(EntityTypeBuilder<Spot> b)
    {
        b.ToTable("Spots");
        b.HasKey(x => x.Id);
        b.Property(x => x.Slug).HasMaxLength(120).IsRequired();
        b.HasIndex(x => x.Slug).IsUnique();
        b.Property(x => x.Title).HasMaxLength(200).IsRequired();
        b.Property(x => x.City).HasMaxLength(60).IsRequired();
        b.HasIndex(x => x.City);
        b.Property(x => x.District).HasMaxLength(120).IsRequired();
        b.Property(x => x.Kind).HasConversion<string>().HasMaxLength(20);
        b.Property(x => x.Status).HasConversion<string>().HasMaxLength(30);
        b.Property(x => x.Summary).HasMaxLength(2000).IsRequired();
        b.Property(x => x.AdoptedBy).HasMaxLength(200);

        b.OwnsOne(x => x.Recheck, r =>
        {
            r.Property(p => p.Date).HasColumnName("RecheckDate");
            r.Property(p => p.Result).HasColumnName("RecheckResult").HasConversion<string>().HasMaxLength(20);
            r.Property(p => p.Note).HasColumnName("RecheckNote").HasMaxLength(2000);
            r.Property(p => p.Photo).HasColumnName("RecheckPhoto").HasMaxLength(500);
        });

        b.HasMany(x => x.Visits).WithOne(v => v.Spot).HasForeignKey(v => v.SpotId).OnDelete(DeleteBehavior.Cascade);
        b.HasMany(x => x.Sponsors).WithOne(s => s.Spot).HasForeignKey(s => s.SpotId).OnDelete(DeleteBehavior.Cascade);
    }
}

public class VisitConfiguration : IEntityTypeConfiguration<Visit>
{
    public void Configure(EntityTypeBuilder<Visit> b)
    {
        b.ToTable("Visits");
        b.HasKey(x => x.Id);
        b.Property(x => x.Kind).HasConversion<string>().HasMaxLength(20);
        b.Property(x => x.Team).HasMaxLength(200);
        b.Property(x => x.PhotoBefore).HasMaxLength(500);
        b.Property(x => x.PhotoAfter).HasMaxLength(500);
        b.Property(x => x.DeliveredTo).HasMaxLength(300);
        b.Property(x => x.Notes).HasMaxLength(2000);
        b.HasIndex(x => new { x.SpotId, x.Date });
        b.HasMany(x => x.Weighings).WithOne(w => w.Visit).HasForeignKey(w => w.VisitId).OnDelete(DeleteBehavior.Cascade);
    }
}

public class WeighingConfiguration : IEntityTypeConfiguration<Weighing>
{
    public void Configure(EntityTypeBuilder<Weighing> b)
    {
        b.ToTable("Weighings");
        b.HasKey(x => x.Id);
        b.Property(x => x.Material).HasConversion<string>().HasMaxLength(20);
        b.Property(x => x.Method).HasConversion<string>().HasMaxLength(10);
        b.Property(x => x.Kg).HasPrecision(8, 2);
    }
}

public class SponsorConfiguration : IEntityTypeConfiguration<Sponsor>
{
    public void Configure(EntityTypeBuilder<Sponsor> b)
    {
        b.ToTable("Sponsors");
        b.HasKey(x => x.Id);
        b.Property(x => x.Key).HasMaxLength(60).IsRequired();
        b.HasIndex(x => x.Key).IsUnique();
        b.Property(x => x.Name).HasMaxLength(200).IsRequired();
        b.Property(x => x.Url).HasMaxLength(300);
        b.Property(x => x.Contribution).HasMaxLength(500);
    }
}

public class SpotSponsorConfiguration : IEntityTypeConfiguration<SpotSponsor>
{
    public void Configure(EntityTypeBuilder<SpotSponsor> b)
    {
        b.ToTable("SpotSponsors");
        b.HasKey(x => new { x.SpotId, x.SponsorId });
        b.HasOne(x => x.Sponsor).WithMany(s => s.Spots).HasForeignKey(x => x.SponsorId).OnDelete(DeleteBehavior.Cascade);
    }
}
