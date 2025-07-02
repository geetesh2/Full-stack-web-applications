using System.ComponentModel.DataAnnotations;

namespace ExpenseTrackerAPI.Models;

public class User
{
    public Guid Id { get; set; }
    [Required]
    public string Username { get; set; }
    [Required]
    public string HashedPassword { get; set; }
}