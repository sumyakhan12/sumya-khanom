import React from 'react';

interface SparklineProps {
  data: number[];
  stroke?: string;
  height?: number;
  label?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  stroke = '#245B52',
  height = 38,
  label = 'Vitals trend',
}) => {
  if (!data || data.length < 2) return null;

  const width = 140;
  const padY = 5;
  const padX = 4;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;

  const points = data.map((val, idx) => {
    const x = padX + (idx / (data.length - 1)) * (width - padX * 2);
    const y = height - padY - ((val - min) / span) * (height - padY * 2);
    return { x, y };
  });

  const linePath = points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${height} L ${points[0].x.toFixed(1)} ${height} Z`;
  const last = points[points.length - 1];
  const gradId = `spark-mediora-${stroke.replace('#', '')}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full overflow-visible"
      style={{ height }}
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.16" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={last.x}
        cy={last.y}
        r="3.2"
        fill="#FFFDF8"
        stroke={stroke}
        strokeWidth="2.2"
      />
    </svg>
  );
};
