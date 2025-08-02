using System.ComponentModel.DataAnnotations;

namespace ExpenseTrackerAPI.Models;

public class Expense
{
    public Guid Id { get; set; }
    
    public Category Category { get; set; } = null!;
    
    public Guid CategoryId { get; set; }

    public decimal Amount { get; set; }
    
    [MaxLength(100)]
    public string? Description { get; set; }
    public DateTime Date { get; set; }
    public Guid  UserId { get; set; }
    public User User { get; set; } = null!;
}