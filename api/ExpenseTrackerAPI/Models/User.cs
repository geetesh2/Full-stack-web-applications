using System.ComponentModel.DataAnnotations;

namespace ExpenseTrackerAPI.Models;

public class User
{
    public Guid Id { get; set; }
    [Required] 
    [EmailAddress]
    [MaxLength(100)]
    public required string Email { get; set; }
    
    [Required]
    [MaxLength(200)]
    public required string HashedPassword { get; set; }
    
    public DateTime CreatedAt { get; set; } 
    
    public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
}