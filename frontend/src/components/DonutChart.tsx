interface Segment {
  value: number;
  color: string;
  label: string;
}

interface Props {
  segments: Segment[];
}

export default function DonutChart({ segments }: Props) {
  const cx = 75, cy = 75, r = 50, sw = 15;
  const circumference = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  if (total === 0) {
    return (
      <svg viewBox="0 0 150 150" width="100%" style={{ maxWidth: 150, display: 'block', margin: '8px auto 0' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f0f0f0" strokeWidth={sw} />
        <text x={cx} y={cy + 5} textAnchor="middle" fill="#aaa" fontSize="11">No data</text>
      </svg>
    );
  }

  let accumulated = 0;
  const arcs = segments.map(seg => {
    const arcLen = (seg.value / total) * circumference;
    const offset = -(accumulated);
    accumulated += arcLen;
    return { ...seg, arcLen, offset };
  });

  const dominant = segments.reduce((a, b) => (a.value > b.value ? a : b));
  const pct = Math.round((dominant.value / total) * 100);

  return (
    <svg viewBox="0 0 150 150" width="100%" style={{ maxWidth: 150, display: 'block', margin: '8px auto 0' }}>
      {/* Background */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f5f5f5" strokeWidth={sw} />

      {/* Segments */}
      {arcs.map((arc, i) => (
        arc.value > 0 && (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={arc.color}
            strokeWidth={sw}
            strokeDasharray={`${arc.arcLen} ${circumference - arc.arcLen}`}
            strokeDashoffset={arc.offset}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        )
      ))}

      {/* Center label */}
      <text x={cx} y={cy + 6} textAnchor="middle" fill="#1a1a2e" fontSize="20" fontWeight="700">{pct}%</text>
    </svg>
  );
}
