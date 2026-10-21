namespace BandirmaSenin.Domain.Entities;

public enum VisitKind
{
    Temizlik,
    Kontrol,
    Iyilestirme,
}

public enum Material
{
    Plastik,
    Cam,
    Metal,
    Kagit,
    Organik,
    Diger,
}

public enum WeighMethod
{
    /// <summary>Kantarla ölçüldü.</summary>
    Tarti,
    /// <summary>Göz kararı; raporda ayrı gösterilir.</summary>
    Tahmin,
}

public class Visit
{
    public Guid Id { get; set; }
    public Guid SpotId { get; set; }
    public Spot Spot { get; set; } = null!;
    public DateOnly Date { get; set; }
    public VisitKind Kind { get; set; }
    public int Volunteers { get; set; }
    public string? Team { get; set; }
    public string? PhotoBefore { get; set; }
    public string? PhotoAfter { get; set; }
    public string? DeliveredTo { get; set; }
    public string? Notes { get; set; }
    public int Order { get; set; }

    public List<Weighing> Weighings { get; set; } = new();
}

public class Weighing
{
    public Guid Id { get; set; }
    public Guid VisitId { get; set; }
    public Visit Visit { get; set; } = null!;
    public Material Material { get; set; }
    public decimal Kg { get; set; }
    public WeighMethod Method { get; set; }
}
