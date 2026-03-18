import { useEffect, useState } from 'react';
import type { Habit } from './api/habits';
import { getHabits, createHabit, deleteHabit, toggleHabit } from './api/habits';
import { useAuth } from './context/AuthContext';
import DashboardPage from './pages/DashboardPage';
import HabitsPage from './pages/HabitsPage';
import AuthPage from './pages/AuthPage';
import './App.css';

type Tab = 'dashboard' | 'habits';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'habits',    label: 'Habits',    icon: '✅' },
];

export default function App() {
  const { token, userEmail, signOut } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('dashboard');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getHabits().then(setHabits).finally(() => setLoading(false));
  }, [token]);

  if (!token) return <AuthPage />;

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

  const initials = userEmail ? userEmail[0].toUpperCase() : 'U';

  return (
    <div className="app-shell">
      <div className="app-card">
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
            <div className="nav-user-email">{userEmail}</div>
            <button className="nav-avatar" onClick={signOut} title="Sign out">
              <span>{initials}</span>
            </button>
          </div>
        </header>

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
