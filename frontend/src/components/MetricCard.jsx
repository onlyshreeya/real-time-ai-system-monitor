import React from 'react';

const colors = {
  blue: { accent: '#22d3ee', track: 'rgba(34,211,238,0.12)', bar: 'rgba(34,211,238,0.9)' },
  purple: { accent: '#a78bfa', track: 'rgba(167,139,250,0.12)', bar: 'rgba(167,139,250,0.9)' },
  green: { accent: '#34d399', track: 'rgba(52,211,153,0.12)', bar: 'rgba(52,211,153,0.9)' },
  orange: { accent: '#fb923c', track: 'rgba(251,146,60,0.12)', bar: 'rgba(251,146,60,0.9)' },
};

export default function MetricCard({ label, value, unit = '%', color = 'blue', trend, icon, pct }) {
  const c = colors[color];
  const barWidth = pct !== undefined ? pct : (parseFloat(value) || 0);

  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '0.5px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '18px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: c.accent, opacity: 0.8,
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
          {label}
        </div>
        <div style={{ fontSize: 18, opacity: 0.6 }}>{icon}</div>
      </div>

      <div style={{ fontSize: 28, fontWeight: 700, color: c.accent, lineHeight: 1, marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
        {value}<span style={{ fontSize: 14, opacity: 0.7 }}>{unit}</span>
      </div>

      {trend && (
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 10 }}>
          <span style={{ color: trend.up ? '#f87171' : '#34d399' }}>
            {trend.up ? '▲' : '▼'} {trend.value}
          </span>
          {' '}vs last interval
        </div>
      )}

      <div style={{ height: 3, background: c.track, borderRadius: 2, marginTop: 8 }}>
        <div style={{
          height: '100%', width: `${Math.min(100, barWidth)}%`,
          background: c.bar, borderRadius: 2,
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  );
}