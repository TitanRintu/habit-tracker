import type { Habit } from '../api/habits';
import HabitCard from '../components/HabitCard';
import AddHabitModal from '../components/AddHabitModal';
import CompletionGrid from '../components/CompletionGrid';
import { useState } from 'react';
import './HabitsPage.css';

type GridView = 'week' | 'month';

interface Props {
  habits: Habit[];
  loading: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onAdd: (name: string, emoji: string) => void;
}

export default function HabitsPage({ habits, loading, onToggle, onDelete, onAdd }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [gridView, setGridView] = useState<GridView>('week');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const completedCount = habits.filter(h => h.completedToday).length;

  return (
    <div className="habits-page">
      <div className="habits-header">
        <div>
          <p className="habits-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h2 className="habits-title">Today's Habits</h2>
        </div>
        <button className="fab" onClick={() => setShowModal(true)}>+</button>
      </div>

      {!loading && habits.length > 0 && (
        <div className="progress-wrap">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${(completedCount / habits.length) * 100}%` }}
            />
          </div>
          <span className="progress-text">{completedCount}/{habits.length}</span>
        </div>
      )}

      <div className="habit-list">
        {loading && <p className="list-msg">Loading...</p>}
        {!loading && habits.length === 0 && (
          <div className="list-empty">
            <div className="list-empty-icon">🌱</div>
            <p>No habits yet</p>
            <p className="list-empty-sub">Tap <strong>+</strong> to add your first habit</p>
          </div>
        )}

        {habits.map(habit => (
          <div key={habit.id} className="habit-block">
            <HabitCard
              habit={habit}
              onToggle={() => onToggle(habit.id)}
              onDelete={() => onDelete(habit.id)}
            />
            <div
              className="history-toggle"
              onClick={() => setExpandedId(expandedId === habit.id ? null : habit.id)}
            >
              <span>{expandedId === habit.id ? '▲ hide' : '▼ history'}</span>
              {expandedId === habit.id && (
                <span className="view-btns" onClick={e => e.stopPropagation()}>
                  <button
                    className={gridView === 'week' ? 'active' : ''}
                    onClick={() => setGridView('week')}
                  >Week</button>
                  <button
                    className={gridView === 'month' ? 'active' : ''}
                    onClick={() => setGridView('month')}
                  >Month</button>
                </span>
              )}
            </div>
            {expandedId === habit.id && (
              <CompletionGrid completedDates={habit.completedDates} view={gridView} />
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <AddHabitModal onAdd={onAdd} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
