using Microsoft.EntityFrameworkCore;
using server.Models;
public class ApplicationDbContext : Microsoft.EntityFrameworkCore.DbContext
{
    public DbSet<HealthReport> Reports { get; set; }
    public DbSet<HealthParameter> Parameters { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }
}
