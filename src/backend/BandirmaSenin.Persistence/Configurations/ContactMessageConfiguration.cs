using BandirmaSenin.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BandirmaSenin.Persistence.Configurations;

public class ContactMessageConfiguration : IEntityTypeConfiguration<ContactMessage>
{
    public void Configure(EntityTypeBuilder<ContactMessage> b)
    {
        b.ToTable("ContactMessages");
        b.HasKey(x => x.Id);
        b.Property(x => x.Kind).HasConversion<string>().HasMaxLength(20);
        b.Property(x => x.Name).HasMaxLength(120).IsRequired();
        b.Property(x => x.Email).HasMaxLength(200).IsRequired();
        b.Property(x => x.Phone).HasMaxLength(40);
        b.Property(x => x.Message).HasMaxLength(4000).IsRequired();
        b.Property(x => x.Note).HasMaxLength(2000);
        b.Property(x => x.Ip).HasMaxLength(64);
        b.HasIndex(x => new { x.IsRead, x.CreatedAt });
    }
}
