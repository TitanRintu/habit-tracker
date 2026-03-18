interface Props {
  value: number; // 0-100
}

export default function GaugeChart({ value }: Props) {
  const cx = 100, cy = 90, r = 68, sw = 14;

  // theta in SVG radians: 0° = right, increases clockwise (y-down)
  // gauge spans from 180° (left) to 360° (right) passing through 270° (top)
  const theta = (Math.PI) + (value / 100) * Math.PI;
  const needleLen = r - sw - 4;
  const nx = cx + needleLen * Math.cos(theta);
  const ny = cy + needleLen * Math.sin(theta);

  // bubble near needle tip
  const bd = r - sw + 6;
  const bx = cx + bd * Math.cos(theta);
  const by = cy + bd * Math.sin(theta);

  const trackD = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;

  return (
    <svg viewBox="0 0 200 115" width="100%" style={{ maxWidth: 200, display: 'block', margin: '8px auto 0' }}>
      <defs>
        <linearGradient id="gGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f06292" />
          <stop offset="100%" stopColor="#ff7043" />
        </linearGradient>
      </defs>

      {/* Track */}
      <path d={trackD} fill="none" stroke="#f0f0f0" strokeWidth={sw} strokeLinecap="round" />

      {/* Fill */}
      {value > 0 && (
        <path
          d={trackD}
          fill="none"
          stroke="url(#gGrad)"
          strokeWidth={sw}
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray={`${Math.min(value, 100)} 100`}
        />
      )}

      {/* Needle */}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="5" fill="#1a1a2e" />

      {/* Value bubble */}
      <rect x={bx - 18} y={by - 13} width="36" height="20" rx="6" fill="#1a1a2e" />
      <text x={bx} y={by + 1} textAnchor="middle" fill="white" fontSize="10" fontWeight="700">{value}%</text>
    </svg>
  );
}
