# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY api/ExpenseTrackerAPI/ExpenseTrackerAPI.csproj api/ExpenseTrackerAPI/
RUN dotnet restore api/ExpenseTrackerAPI/ExpenseTrackerAPI.csproj

# Copy the full source code
COPY api/ExpenseTrackerAPI/ api/ExpenseTrackerAPI/
WORKDIR /src/api/ExpenseTrackerAPI

#Publish only the API project (ignore test projects)
RUN dotnet publish ExpenseTrackerAPI.csproj -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Configure ASP.NET Core environment
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80

ENTRYPOINT ["dotnet", "ExpenseTrackerAPI.dll"]
