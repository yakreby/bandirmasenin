namespace BandirmaSenin.Domain.Entities;

public enum ContactKind
{
    /// <summary>Pazar temizliğine katılmak istiyor.</summary>
    Katilim,
    /// <summary>Kirli bir nokta öneriyor.</summary>
    NoktaOneri,
    /// <summary>Destekçi olmak istiyor (ekipman, atık kabulü, bütçe).</summary>
    Destek,
    Diger,
}

/// <summary>İletişim formundan gelen mesaj. Yönetici paneli okur ve işaretler.</summary>
public class ContactMessage
{
    public Guid Id { get; set; }
    public ContactKind Kind { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Message { get; set; } = string.Empty;
    /// <summary>Nokta önerisinde isteğe bağlı konum.</summary>
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public bool IsRead { get; set; }
    public string? Note { get; set; }
    public string? Ip { get; set; }
    public DateTime CreatedAt { get; set; }
}
