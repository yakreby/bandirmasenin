namespace BandirmaSenin.Domain.Entities;

public enum TraceStatus
{
    /// <summary>Gönüllü bıraktı, yönetici henüz bakmadı. Haritada görünmez.</summary>
    Pending,
    /// <summary>Onaylandı, haritada "iz" olarak görünür.</summary>
    Approved,
    /// <summary>Reddedildi (spam, konu dışı, kişi/plaka içeriyor…). Haritada görünmez.</summary>
    Rejected,
}

public enum TraceKind
{
    /// <summary>Karışık çöp yığını.</summary>
    Karisik,
    Plastik,
    Cam,
    /// <summary>İnşaat atığı, moloz.</summary>
    Moloz,
    /// <summary>Tehlikeli ya da tıbbi atık; dokunulmaz, belediyeye bildirilir.</summary>
    Tehlikeli,
    Diger,
}

/// <summary>
/// "İz bırak": bir gönüllünün uygulama içinden kamerayı açıp çektiği çöp fotoğrafı ve o anki konumu.
/// Anonimdir; isim, e-posta yoktur. Yönetici onaylayınca haritaya düşer, Pazar planına girdi olur.
/// </summary>
public class TraceReport
{
    public Guid Id { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    /// <summary>Cihazın bildirdiği konum doğruluğu (metre); yoksa null.</summary>
    public double? AccuracyM { get; set; }
    public TraceKind Kind { get; set; }
    /// <summary>Gönüllünün kısa notu (isteğe bağlı).</summary>
    public string? Note { get; set; }
    /// <summary>Depodaki göreli yol: traces/{guid}.jpg. Tam URL istek anında kurulur.</summary>
    public string PhotoPath { get; set; } = string.Empty;
    public TraceStatus Status { get; set; } = TraceStatus.Pending;
    /// <summary>Yalnız kötüye kullanım takibi için; dışarıya hiçbir uçtan verilmez.</summary>
    public string? Ip { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? ReviewNote { get; set; }
}
