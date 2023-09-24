using System.ComponentModel.DataAnnotations;

namespace backend.Core.Entities;

public abstract class BaseEntity
{
    [Key]
    public long Id { get; set; }
    
    [DisplayFormat (DataFormatString = "{0:yyyy-MM-dd}")]
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    
    [DisplayFormat (DataFormatString = "{0:yyyy-MM-dd}")]
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
    
    public bool IsActive { get; set; } = true;
}