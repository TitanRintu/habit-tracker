# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY HabitTracker.Api.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app --no-restore

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app .

# SQLite data lives on a Railway volume mounted at /data
RUN mkdir -p /data

EXPOSE 8080
ENTRYPOINT ["dotnet", "HabitTracker.Api.dll"]
