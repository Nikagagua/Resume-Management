using System.ComponentModel.DataAnnotations;
using backend.Core.Enums;

namespace backend.Core.Dtos.Job;

public class JobGetDto
{
    public long Id { get; set; }
    public string? Title { get; set; }
    public JobLevel Level { get; set; }
    public long CompanyId { get; set; }
    public string? CompanyName { get; set; }

    [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}")]
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}