namespace BandirmaSenin.Domain.Entities;

public class Sponsor
{
    public Guid Id { get; set; }
    /// <summary>Kısa anahtar; arayüzde ve JSON'da "id" olarak görünür (ör. "formex").</summary>
    public string Key { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Url { get; set; }
    public string? Contribution { get; set; }
    public bool IsActive { get; set; } = true;
    public int Order { get; set; }

    public List<SpotSponsor> Spots { get; set; } = new();
}

public class SpotSponsor
{
    public Guid SpotId { get; set; }
    public Spot Spot { get; set; } = null!;
    public Guid SponsorId { get; set; }
    public Sponsor Sponsor { get; set; } = null!;
}
