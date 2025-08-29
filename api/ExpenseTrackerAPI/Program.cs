using AspNetCoreRateLimit;
using ExpenseTrackerAPI.Context;
using ExpenseTrackerAPI.Extensions; 
using Microsoft.EntityFrameworkCore;
using Serilog;

// 1. Configure Serilog for bootstrap logging
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    Log.Information("Starting the application");

    var builder = WebApplication.CreateBuilder(args);

    // 2. Configure Serilog to read from appsettings.json
    builder.Host.UseSerilog((context, services, configuration) => configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext());

    // 3. Add services to the container using Extension Methods
    builder.Services.AddControllers();
    builder.Services.AddProblemDetails(); // For global error handling

    // Custom Extension Methods for clean DI
    builder.Services.AddApplicationServices();
    builder.Services.AddSwaggerServices();
    builder.Services.AddAuthenticationServices(builder.Configuration);
    builder.Services.AddRateLimitingServices(builder.Configuration);
    builder.Services.AddAndConfigureCors(builder.Configuration);

    // Add DBContext
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(builder.Configuration.GetConnectionString("OnlineConnection")));

    var app = builder.Build();

    // 4. Configure the HTTP request pipeline
    app.UseSerilogRequestLogging(); // Log all incoming requests
    app.UseExceptionHandler();      // Use global error handler

        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ExpenseTrackerAPI v1"));

    // Apply DB Migrations
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.Migrate();
    }

    app.UseHttpsRedirection();
    app.UseIpRateLimiting();
    app.UseCors("AllowSpecificOrigins"); // Use the named CORS policy
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}