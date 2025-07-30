using ExpenseTrackerAPI.DTOs;

namespace ExpenseTrackerAPI.Interfaces;

public interface IAuthService
{
    Task<(bool Success, string Message)> RegisterAsync(UserDto request);
    Task<string?> LoginAsync(UserDto request);

}