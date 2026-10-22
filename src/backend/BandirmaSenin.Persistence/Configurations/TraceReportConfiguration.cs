using BandirmaSenin.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BandirmaSenin.Persistence.Configurations;

public class TraceReportConfiguration : IEntityTypeConfiguration<TraceReport>
{
    public void Configure(EntityTypeBuilder<TraceReport> b)
    {
        b.ToTable("TraceReports");
        b.HasKey(x => x.Id);
        b.Property(x => x.Kind).HasConversion<string>().HasMaxLength(20);
        b.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
        b.Property(x => x.Note).HasMaxLength(300);
        b.Property(x => x.PhotoPath).HasMaxLength(200).IsRequired();
        b.Property(x => x.Ip).HasMaxLength(64);
        b.Property(x => x.ReviewNote).HasMaxLength(1000);
        b.HasIndex(x => new { x.Status, x.CreatedAt });
    }
}
