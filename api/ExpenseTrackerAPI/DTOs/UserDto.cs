using System.ComponentModel.DataAnnotations;

namespace ExpenseTrackerAPI.DTOs;

public class UserDto
{
    [EmailAddress]
    public required string Email { get; set; }
    public required string Password { get; set; }
}