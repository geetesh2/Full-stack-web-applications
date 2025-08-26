using ExpenseTrackerAPI.Interfaces;
using ExpenseTrackerAPI.Services;

namespace ExpenseTrackerAPI.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IExpenseService, ExpenseService>();
        services.AddScoped<IAiInsightService, AiInsightService>();
        services.AddScoped<IBudgetService, BudgetService>();
        services.AddHttpClient();

        return services;
    }
}