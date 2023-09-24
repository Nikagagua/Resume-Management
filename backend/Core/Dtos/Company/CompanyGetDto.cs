using System.ComponentModel.DataAnnotations;
using backend.Core.Enums;

namespace backend.Core.Dtos.Company;

public class CompanyGetDto
{
    public long Id { get; set; }
    public string? Name { get; set; }
    public CompanySize Size { get; set; }
    
    [DisplayFormat (DataFormatString = "{0:yyyy-MM-dd}")]
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}