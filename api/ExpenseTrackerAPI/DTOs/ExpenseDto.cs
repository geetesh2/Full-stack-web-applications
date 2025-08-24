namespace ExpenseTrackerAPI.DTOs;

public class ExpenseDto
{
    public string CategoryName { get; set; }
    public decimal Amount { get; set; }
    public string? Description { get; set; }
    public DateTime Date { get; set; }
}