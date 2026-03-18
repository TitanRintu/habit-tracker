import type { Habit } from '../api/habits';
import GaugeChart from '../components/GaugeChart';
import DonutChart from '../components/DonutChart';
import './DashboardPage.css';

interface Props {
  habits: Habit[];
}

export default function DashboardPage({ habits }: Props) {
  const total = habits.length;
  const completedToday = habits.filter(h => h.completedToday).length;
  const onStreak = habits.filter(h => h.streak > 0).length;
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
  const completionRate = total > 0 ? Math.round((completedToday / total) * 100) : 0;

  const missed = habits.filter(h => !h.completedToday && h.completedDates.length > 0).length;
  const neverStarted = habits.filter(h => h.completedDates.length === 0).length;

  const stats = [
    { label: 'Total Habits', value: total, icon: '✅', color: '#4caf50', bg: '#e8f5e9' },
    { label: 'Done Today', value: completedToday, icon: '💪', color: '#e91e63', bg: '#fce4ec' },
    { label: 'On Streak', value: onStreak, icon: '🔥', color: '#ff7043', bg: '#fbe9e7' },
    { label: 'Best Streak', value: `${bestStreak}d`, icon: '🏆', color: '#7c6af0', bg: '#ede7f6' },
  ];

  return (
    <div className="dash">
      {/* Stat cards */}
      <div className="stat-grid">
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}>
              <span>{s.icon}</span>
            </div>
            <div className="stat-body">
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent habits table */}
      <div className="dash-card">
        <div className="dash-card-header">
          <span className="dash-card-title">Today's Habits</span>
          <div className="tab-pills">
            <span className="tab-pill active">All</span>
            <span className="tab-pill">Done</span>
            <span className="tab-pill">Pending</span>
          </div>
        </div>
        <table className="habit-table">
          <thead>
            <tr>
              <th>Habit</th>
              <th>Started</th>
              <th>Streak</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {habits.length === 0 && (
              <tr>
                <td colSpan={4} className="table-empty">No habits yet — add one!</td>
              </tr>
            )}
            {habits.slice(0, 5).map(h => (
              <tr key={h.id}>
                <td>
                  <span className="table-emoji">{h.emoji}</span>
                  {h.name}
                </td>
                <td>
                  {new Date(h.createdAt).toLocaleDateString('en-US', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </td>
                <td>🔥 {h.streak}d</td>
                <td>
                  <span className={`status-badge ${h.completedToday ? 'done' : 'pending'}`}>
                    {h.completedToday ? 'Completed' : 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Charts row */}
      <div className="charts-row">
        <div className="dash-card chart-card">
          <div className="dash-card-header">
            <span className="dash-card-title">Completion Rate</span>
            <span className="more-btn">···</span>
          </div>
          <GaugeChart value={completionRate} />
          <div className="chart-legend">
            <span className="legend-dot" style={{ background: '#f06292' }} />
            <span className="legend-text">Completed</span>
            <span className="legend-dot" style={{ background: '#e0e0e0' }} />
            <span className="legend-text">Pending</span>
          </div>
        </div>

        <div className="dash-card chart-card">
          <div className="dash-card-header">
            <span className="dash-card-title">Habit Status</span>
            <span className="more-btn">···</span>
          </div>
          <DonutChart
            segments={[
              { value: completedToday, color: '#ff7043', label: 'Done' },
              { value: missed, color: '#f06292', label: 'Missed' },
              { value: neverStarted, color: '#d0d0e0', label: 'New' },
            ]}
          />
          <div className="chart-legend">
            <span className="legend-dot" style={{ background: '#ff7043' }} />
            <span className="legend-text">Done</span>
            <span className="legend-dot" style={{ background: '#f06292' }} />
            <span className="legend-text">Missed</span>
            <span className="legend-dot" style={{ background: '#d0d0e0' }} />
            <span className="legend-text">New</span>
          </div>
        </div>
      </div>
    </div>
  );
}
