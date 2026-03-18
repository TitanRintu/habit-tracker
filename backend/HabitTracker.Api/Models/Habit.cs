namespace HabitTracker.Api.Models;

public class Habit
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Emoji { get; set; } = "✅";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsArchived { get; set; } = false;
    public string UserId { get; set; } = string.Empty;

    public ICollection<HabitLog> Logs { get; set; } = [];
}
