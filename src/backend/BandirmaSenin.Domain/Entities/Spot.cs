namespace BandirmaSenin.Domain.Entities;

public enum SpotStatus
{
    TespitEdildi,
    Planlandi,
    Tamamlandi,
    YenidenKontrolEdilecek,
    TekrarKirlendi,
}

public enum SpotKind
{
    Sahil,
    Park,
    Sokak,
    Dere,
    Diger,
}

public enum RecheckResult
{
    Temiz,
    Kismen,
    TekrarKirlendi,
}

/// <summary>Haritadaki bir nokta. Ziyaretler ve tartımlar alt kayıtlardır.</summary>
public class Spot
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string City { get; set; } = "bandirma";
    public string District { get; set; } = string.Empty;
    public SpotKind Kind { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public SpotStatus Status { get; set; }
    public string Summary { get; set; } = string.Empty;
    public string? AdoptedBy { get; set; }
    public DateOnly? RecheckDue { get; set; }
    public Recheck? Recheck { get; set; }
    public bool IsDemo { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public List<Visit> Visits { get; set; } = new();
    public List<SpotSponsor> Sponsors { get; set; } = new();
}

/// <summary>30 gün sonra kontrol sonucu; Spot'a gömülü (owned) tutulur.</summary>
public class Recheck
{
    public DateOnly Date { get; set; }
    public RecheckResult Result { get; set; }
    public string? Note { get; set; }
    public string? Photo { get; set; }
}
