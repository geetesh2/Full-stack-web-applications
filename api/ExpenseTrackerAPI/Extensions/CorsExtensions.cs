namespace ExpenseTrackerAPI.Extensions;

public static class CorsExtensions
{
    public static IServiceCollection AddAndConfigureCors(this IServiceCollection services, IConfiguration config)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowSpecificOrigins",
                policy =>
                {
                    var allowedOrigins = config.GetSection("AllowedOrigins").Get<string[]>();
                    if (allowedOrigins != null && allowedOrigins.Length > 0)
                    {
                        policy.WithOrigins(allowedOrigins)
                              .AllowAnyHeader()
                              .AllowAnyMethod();
                    }
                });
        });

        return services;
    }
}