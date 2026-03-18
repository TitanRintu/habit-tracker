interface Props {
  completedDates: string[];
  view: 'week' | 'month';
}

function getDaysForView(view: 'week' | 'month'): Date[] {
  const days: Date[] = [];
  const today = new Date();
  const count = view === 'week' ? 7 : 30;

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }
  return days;
}

function toLocalDateStr(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default function CompletionGrid({ completedDates, view }: Props) {
  const days = getDaysForView(view);
  const completed = new Set(completedDates);
  const today = toLocalDateStr(new Date());

  return (
    <div className={`grid grid-${view}`}>
      {days.map(day => {
        const str = toLocalDateStr(day);
        const done = completed.has(str);
        const isToday = str === today;
        return (
          <div
            key={str}
            className={`grid-cell ${done ? 'done' : ''} ${isToday ? 'today' : ''}`}
            title={str}
          />
        );
      })}
    </div>
  );
}
