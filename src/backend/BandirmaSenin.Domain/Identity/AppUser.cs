using Microsoft.AspNetCore.Identity;

namespace BandirmaSenin.Domain.Identity;

public enum MembershipStatus
{
    /// <summary>Kayıt oldu, yönetici henüz onaylamadı. Giriş yapabilir, üye ayrıcalıkları kapalı.</summary>
    Pending,
    Approved,
    Rejected,
}

public static class AppRoles
{
    public const string Admin = "Admin";
    public const string Member = "Member";
}

public class AppUser : IdentityUser<Guid>
{
    public string FullName { get; set; } = string.Empty;
    public MembershipStatus Status { get; set; } = MembershipStatus.Pending;
    public DateTime CreatedAt { get; set; }
    public DateTime? KvkkAcceptedAt { get; set; }
    public DateTime? ApprovedAt { get; set; }
    /// <summary>Yöneticinin üye hakkında notu (ör. "Pazar 1'e geldi").</summary>
    public string? AdminNote { get; set; }
}
