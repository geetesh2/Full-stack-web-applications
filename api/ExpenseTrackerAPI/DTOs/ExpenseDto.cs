namespace ExpenseTrackerAPI.DTOs;

public class ExpenseDto
{
    public Guid Id { get; set; }
    public string? ExpenseType { get; set; }
    public double Amount { get; set; }
    public string? Description { get; set; }
    public DateTime Date { get; set; }
}