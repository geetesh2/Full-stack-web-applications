namespace ExpenseTrackerAPI.Models;

public class Expense
{
    public Guid Id { get; set; }
    public string? ExpenseType { get; set; }
    public double Amount { get; set; }
    public string? Description { get; set; }
    public DateTime Date { get; set; }
    public Guid  UserId { get; set; }
    
    public User User { get; set; } = null!;
}