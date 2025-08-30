# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY api/ExpenseTrackerAPI/ExpenseTrackerAPI.csproj api/ExpenseTrackerAPI/
RUN dotnet restore api/ExpenseTrackerAPI/ExpenseTrackerAPI.csproj

# Copy full source
COPY api/ExpenseTrackerAPI/ api/ExpenseTrackerAPI/
WORKDIR /src/api/ExpenseTrackerAPI
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Render provides PORT env variable
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80


ENTRYPOINT ["dotnet", "ExpenseTrackerAPI.dll"]
