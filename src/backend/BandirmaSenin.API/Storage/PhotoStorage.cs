using Microsoft.Extensions.Options;

namespace BandirmaSenin.API.Storage;

public sealed class UploadsOptions
{
    public const string Section = "Uploads";

    /// <summary>Dosyaların yazıldığı kök dizin. Göreli verilirse içerik köküne göre çözülür. Varsayılan: wwwroot/uploads.</summary>
    public string Root { get; set; } = "wwwroot/uploads";

    /// <summary>Dosyaların dışarıdan okunduğu taban adres (ör. https://bs.limanyazilim.com). Boşsa isteğin kendi adresi kullanılır.</summary>
    public string? PublicBaseUrl { get; set; }

    /// <summary>Bir iz fotoğrafı için üst sınır (bayt). İstemci zaten 1600px JPEG'e küçültür.</summary>
    public long MaxPhotoBytes { get; set; } = 6_000_000;
}

/// <summary>
/// Fotoğraf deposu. İlk sürüm yerel disk (API sunucusu /uploads altından statik servis eder);
/// R2/S3'e geçerken yalnız bu arayüzün gerçeklemesi değişir, controller'lar aynı kalır.
/// </summary>
public interface IPhotoStorage
{
    /// <summary>Akışı kaydeder, depodaki göreli yolu döner (ör. traces/3f2a….jpg).</summary>
    Task<string> SaveAsync(Stream content, string folder, string extension, CancellationToken ct);

    Task DeleteAsync(string relativePath, CancellationToken ct);

    /// <summary>Göreli yolu tam URL'ye çevirir.</summary>
    string PublicUrl(string relativePath, string requestBaseUrl);
}

public sealed class LocalPhotoStorage : IPhotoStorage
{
    private readonly string _root;
    private readonly UploadsOptions _opt;

    public LocalPhotoStorage(IOptions<UploadsOptions> opt, IHostEnvironment env)
    {
        _opt = opt.Value;
        _root = Path.IsPathRooted(_opt.Root) ? _opt.Root : Path.Combine(env.ContentRootPath, _opt.Root);
        Directory.CreateDirectory(_root);
    }

    public string RootPath => _root;

    public async Task<string> SaveAsync(Stream content, string folder, string extension, CancellationToken ct)
    {
        var safeFolder = folder.Trim('/', '\\');
        var dir = Path.Combine(_root, safeFolder);
        Directory.CreateDirectory(dir);
        var name = $"{Guid.NewGuid():N}{extension}";
        var full = Path.Combine(dir, name);
        await using var fs = new FileStream(full, FileMode.CreateNew, FileAccess.Write, FileShare.None, 64 * 1024, useAsync: true);
        await content.CopyToAsync(fs, ct);
        return $"{safeFolder}/{name}";
    }

    public Task DeleteAsync(string relativePath, CancellationToken ct)
    {
        var full = Path.GetFullPath(Path.Combine(_root, relativePath.Replace('/', Path.DirectorySeparatorChar)));
        if (full.StartsWith(_root, StringComparison.OrdinalIgnoreCase) && File.Exists(full))
            File.Delete(full);
        return Task.CompletedTask;
    }

    public string PublicUrl(string relativePath, string requestBaseUrl)
    {
        var b = string.IsNullOrWhiteSpace(_opt.PublicBaseUrl) ? requestBaseUrl : _opt.PublicBaseUrl!;
        return $"{b.TrimEnd('/')}/uploads/{relativePath}";
    }
}
