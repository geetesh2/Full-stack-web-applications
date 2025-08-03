using System.Net.Http;
using System.Text;
using System.Text.Json;
using ExpenseTrackerAPI.Interfaces;
using ExpenseTrackerAPI.Models;

namespace ExpenseTrackerAPI.Services;

public class AiInsightService : IAiInsightService
{
    private readonly HttpClient _httpClient;
    private readonly string _geminiApiKey;
    private readonly string _geminiModelName;

    public AiInsightService(IHttpClientFactory httpClientFactory, IConfiguration config)
    {
        _httpClient = httpClientFactory.CreateClient();
        _geminiApiKey = config["Gemini:ApiKey"] ?? throw new InvalidOperationException("Gemini API key is missing.");
        _geminiModelName = config["Gemini:ModelName"] ?? "gemini-1.5-pro-latest";
    }

    public async Task<string> GenerateInsightsFromExpensesAsync(IEnumerable<Expense> expenses, IEnumerable<Budget> budgets)
    {
        var expenseData = expenses.Select(e => new
        {
            Date = e.Date.ToString("yyyy-MM-dd"),
            Amount = e.Amount,
            Category = e.Category?.Name ?? "Uncategorized",
            Description = e.Description ?? ""
        });

        var budgetData = budgets.Select(b => new
        {
            Category = b.Category?.Name ?? "Uncategorized",
            MonthlyLimit = b.LimitAmount,
            Month = b.Month.ToString("yyyy-MM"),
            Year = b.Year.ToString("yyyy")
            
        });

        var userPrompt = $@"
Please analyze the following personal finance data and provide insights on:

1. Spending pattern analysis (e.g., frequent categories, highest spends)
2. Monthly spending trends
3. Budgeting suggestions (are budgets effective? where to adjust?)
4. Anomaly detection (any large/unusual expenses)

All values are in Indian Rupees (INR).

Expenses:
{JsonSerializer.Serialize(expenseData, new JsonSerializerOptions { WriteIndented = true })}

Budgets:
{JsonSerializer.Serialize(budgetData, new JsonSerializerOptions { WriteIndented = true })}

Output the insights in bullet points with clear and actionable advice.
";

        var requestBody = new
        {
            systemInstruction = new
            {
                parts = new[]
                {
                    new { text = "You are a professional personal finance advisor. Speak clearly, use bullet points, and give specific recommendations for Indian users." }
                }
            },
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new { text = userPrompt }
                    }
                }
            }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var url = $"https://generativelanguage.googleapis.com/v1beta/models/{_geminiModelName}:generateContent?key={_geminiApiKey}";

        try
        {
            var response = await _httpClient.PostAsync(url, content);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                return $"❌ Gemini API Error: {response.StatusCode}\n\n{responseContent}";

            using var doc = JsonDocument.Parse(responseContent);

            if (doc.RootElement.TryGetProperty("candidates", out var candidates) &&
                candidates.GetArrayLength() > 0 &&
                candidates[0].TryGetProperty("content", out var responseContentElement) &&
                responseContentElement.TryGetProperty("parts", out var parts) &&
                parts.GetArrayLength() > 0 &&
                parts[0].TryGetProperty("text", out var textElement))
            {
                return textElement.GetString() ?? "Gemini returned a blank insight.";
            }

            return "❌ Gemini did not return a valid structure.";
        }
        catch (Exception ex)
        {
            return $"❌ Error: {ex.Message}";
        }
    }
}
