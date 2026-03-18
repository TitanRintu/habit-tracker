import type { Habit } from '../api/habits';

interface Props {
  habit: Habit;
  onToggle: () => void;
  onDelete: () => void;
}

export default function HabitCard({ habit, onToggle, onDelete }: Props) {
  return (
    <div className={`habit-card ${habit.completedToday ? 'completed' : ''}`}>
      <button className="check-btn" onClick={onToggle} aria-label="Toggle habit">
        <span className="habit-emoji">{habit.emoji}</span>
        {habit.completedToday && <span className="checkmark">✓</span>}
      </button>
      <div className="habit-info">
        <span className="habit-name">{habit.name}</span>
        <span className="habit-streak">
          {habit.streak > 0 ? `🔥 ${habit.streak} day streak` : 'Start today!'}
        </span>
      </div>
      <button className="delete-btn" onClick={onDelete} aria-label="Delete habit">×</button>
    </div>
  );
}
