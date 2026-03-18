using HabitTracker.Api.Data;
using HabitTracker.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HabitTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HabitsController(AppDbContext db) : ControllerBase
{
    // GET /api/habits
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var habits = await db.Habits
            .Where(h => !h.IsArchived)
            .Include(h => h.Logs)
            .OrderBy(h => h.CreatedAt)
            .ToListAsync();

        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var result = habits.Select(h => MapToDto(h, today));
        return Ok(result);
    }

    // POST /api/habits
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateHabitDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest("Name is required.");

        var habit = new Habit { Name = dto.Name.Trim(), Emoji = dto.Emoji ?? "✅" };
        db.Habits.Add(habit);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = habit.Id }, MapToDto(habit, DateOnly.FromDateTime(DateTime.UtcNow)));
    }

    // DELETE /api/habits/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var habit = await db.Habits.FindAsync(id);
        if (habit is null) return NotFound();
        habit.IsArchived = true;
        await db.SaveChangesAsync();
        return NoContent();
    }

    // POST /api/habits/{id}/toggle?date=2025-03-18
    [HttpPost("{id}/toggle")]
    public async Task<IActionResult> Toggle(int id, [FromQuery] string? date)
    {
        var habit = await db.Habits.Include(h => h.Logs).FirstOrDefaultAsync(h => h.Id == id);
        if (habit is null) return NotFound();

        var targetDate = date is not null
            ? DateOnly.Parse(date)
            : DateOnly.FromDateTime(DateTime.UtcNow);

        var existing = habit.Logs.FirstOrDefault(l => l.Date == targetDate);
        if (existing is not null)
        {
            db.HabitLogs.Remove(existing);
        }
        else
        {
            db.HabitLogs.Add(new HabitLog { HabitId = id, Date = targetDate });
        }

        await db.SaveChangesAsync();

        // Reload logs for updated dto
        await db.Entry(habit).Collection(h => h.Logs).LoadAsync();
        return Ok(MapToDto(habit, DateOnly.FromDateTime(DateTime.UtcNow)));
    }

    // GET /api/habits/{id}/logs?from=2025-01-01&to=2025-03-18
    [HttpGet("{id}/logs")]
    public async Task<IActionResult> GetLogs(int id, [FromQuery] string? from, [FromQuery] string? to)
    {
        var habit = await db.Habits.FindAsync(id);
        if (habit is null) return NotFound();

        var query = db.HabitLogs.Where(l => l.HabitId == id);

        if (from is not null) query = query.Where(l => l.Date >= DateOnly.Parse(from));
        if (to is not null) query = query.Where(l => l.Date <= DateOnly.Parse(to));

        var logs = await query.Select(l => l.Date.ToString("yyyy-MM-dd")).ToListAsync();
        return Ok(logs);
    }

    private static HabitDto MapToDto(Habit h, DateOnly today)
    {
        var sortedDates = h.Logs.Select(l => l.Date).OrderByDescending(d => d).ToList();
        var streak = CalculateStreak(sortedDates, today);
        var completedToday = sortedDates.Contains(today);

        return new HabitDto(
            h.Id,
            h.Name,
            h.Emoji,
            h.CreatedAt,
            completedToday,
            streak,
            sortedDates.Select(d => d.ToString("yyyy-MM-dd")).ToList()
        );
    }

    private static int CalculateStreak(List<DateOnly> sortedDates, DateOnly today)
    {
        if (sortedDates.Count == 0) return 0;

        var streak = 0;
        var check = sortedDates.Contains(today) ? today : today.AddDays(-1);

        foreach (var date in sortedDates)
        {
            if (date == check)
            {
                streak++;
                check = check.AddDays(-1);
            }
            else if (date < check)
            {
                break;
            }
        }

        return streak;
    }
}

public record CreateHabitDto(string Name, string? Emoji);
public record HabitDto(
    int Id,
    string Name,
    string Emoji,
    DateTime CreatedAt,
    bool CompletedToday,
    int Streak,
    List<string> CompletedDates
);
