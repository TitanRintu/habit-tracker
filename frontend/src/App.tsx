import { useEffect, useState } from 'react';
import type { Habit } from './api/habits';
import { getHabits, createHabit, deleteHabit, toggleHabit } from './api/habits';
import DashboardPage from './pages/DashboardPage';
import HabitsPage from './pages/HabitsPage';
import './App.css';

type Tab = 'dashboard' | 'habits';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'habits',    label: 'Habits',    icon: '✅' },
];

export default function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('dashboard');

  useEffect(() => {
    getHabits().then(setHabits).finally(() => setLoading(false));
  }, []);

  const handleAdd = async (name: string, emoji: string) => {
    const habit = await createHabit(name, emoji);
    setHabits(prev => [...prev, habit]);
  };

  const handleToggle = async (id: number) => {
    const updated = await toggleHabit(id);
    setHabits(prev => prev.map(h => (h.id === id ? updated : h)));
  };

  const handleDelete = async (id: number) => {
    await deleteHabit(id);
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  return (
    <div className="app-shell">
      <div className="app-card">
        {/* Top nav */}
        <header className="app-nav">
          <div className="nav-tabs">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`nav-tab ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                <span className="nav-icon">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
          <div className="nav-actions">
            <button className="nav-icon-btn">🔔</button>
            <button className="nav-icon-btn">✉️</button>
            <button className="nav-avatar">
              <span>H</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="app-content">
          {tab === 'dashboard' && <DashboardPage habits={habits} />}
          {tab === 'habits' && (
            <HabitsPage
              habits={habits}
              loading={loading}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onAdd={handleAdd}
            />
          )}
        </main>
      </div>
    </div>
  );
}
