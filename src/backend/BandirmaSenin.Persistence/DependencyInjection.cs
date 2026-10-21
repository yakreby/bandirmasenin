using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BandirmaSenin.Persistence;

public static class DependencyInjection
{
    public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration config)
    {
        var cs = config.GetConnectionString("Default")
                 ?? throw new InvalidOperationException("ConnectionStrings:Default tanımlı değil.");

        services.AddDbContext<AppDbContext>(o =>
            o.UseSqlServer(cs, sql => sql.EnableRetryOnFailure(3)));

        services.AddScoped<DbSeeder>();
        return services;
    }
}
