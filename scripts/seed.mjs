const API = 'https://api-production-e1a4.up.railway.app/api';

const habits = [
  { name: 'Morning Run',   emoji: '🏃' },
  { name: 'Read 30 mins',  emoji: '📚' },
  { name: 'Drink Water',   emoji: '💧' },
  { name: 'Meditate',      emoji: '🧘' },
  { name: 'No Junk Food',  emoji: '🥗' },
];

// Delete existing broken habits (IDs 1-5)
console.log('Deleting broken habits...');
for (let id = 1; id <= 5; id++) {
  const res = await fetch(`${API}/habits/${id}`, { method: 'DELETE' });
  console.log(`  DELETE /habits/${id} → ${res.status}`);
}

// Re-add with correct emojis
console.log('\nAdding habits with correct emojis...');
for (const habit of habits) {
  const res = await fetch(`${API}/habits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(habit),
  });
  const data = await res.json();
  console.log(`  Created: ${data.emoji} ${data.name} (id=${data.id})`);
}

// Backfill history for streaks
console.log('\nBackfilling history...');
const all = await fetch(`${API}/habits`).then(r => r.json());
const [run, read, water, meditate] = all;

const today = new Date();
const daysAgo = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};

// Morning Run — 7 day streak
for (let i = 0; i <= 6; i++) {
  await fetch(`${API}/habits/${run.id}/toggle?date=${daysAgo(i)}`, { method: 'POST' });
}
// Read 30 mins — 4 day streak
for (let i = 0; i <= 3; i++) {
  await fetch(`${API}/habits/${read.id}/toggle?date=${daysAgo(i)}`, { method: 'POST' });
}
// Drink Water — today only
await fetch(`${API}/habits/${water.id}/toggle`, { method: 'POST' });
// Meditate — today only
await fetch(`${API}/habits/${meditate.id}/toggle`, { method: 'POST' });

// Verify
console.log('\nFinal state:');
const final = await fetch(`${API}/habits`).then(r => r.json());
for (const h of final) {
  console.log(`  ${h.emoji} ${h.name} — streak: ${h.streak}d, today: ${h.completedToday}`);
}
