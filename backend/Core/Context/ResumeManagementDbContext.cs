using backend.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Core.Context;

public class ResumeManagementDbContext : DbContext
{
    public ResumeManagementDbContext(DbContextOptions<ResumeManagementDbContext> options)
        : base(options)
    {
    }

    public DbSet<Company>? Companies { get; set; }
    public DbSet<Job>? Jobs { get; set; }
    public DbSet<Candidate>? Candidates { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Job>()
            .HasOne(j => j.Company)
            .WithMany(c => c.Jobs)
            .HasForeignKey(j => j.CompanyId);

        modelBuilder.Entity<Candidate>()
            .HasOne(c => c.Job)
            .WithMany(j => j.Candidates)
            .HasForeignKey(c => c.JobId);

        modelBuilder.Entity<Company>()
            .Property(c => c.Size)
            .HasConversion<string>();

        modelBuilder.Entity<Job>()
            .Property(j => j.Level)
            .HasConversion<string>();
    }
}