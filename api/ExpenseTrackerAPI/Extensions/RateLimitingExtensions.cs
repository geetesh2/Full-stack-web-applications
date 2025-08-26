using AspNetCoreRateLimit;

namespace ExpenseTrackerAPI.Extensions;

public static class RateLimitingExtensions
{
    public static IServiceCollection AddRateLimitingServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddMemoryCache();
        services.Configure<IpRateLimitOptions>(config.GetSection("IpRateLimiting"));
        services.AddSingleton<IIpPolicyStore, MemoryCacheIpPolicyStore>();
        services.AddSingleton<IRateLimitCounterStore, MemoryCacheRateLimitCounterStore>();
        services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();
        services.AddSingleton<IProcessingStrategy, AsyncKeyLockProcessingStrategy>();
        services.AddInMemoryRateLimiting();

        return services;
    }
}