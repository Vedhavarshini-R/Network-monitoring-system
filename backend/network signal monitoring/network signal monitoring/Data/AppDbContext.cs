using Microsoft.EntityFrameworkCore;
using network_signal_monitoring.Models;

namespace network_signal_monitoring.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<NetworkSignal> NetworkSignals { get; set; }
    }
}