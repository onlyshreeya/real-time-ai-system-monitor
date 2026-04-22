import React from 'react';

export default function StatsRow({ metrics }) {
  if (!metrics || metrics.length < 2) return null;

  const cpuValues = metrics.map((m) => m.cpuUsage);
  const memValues = metrics.map((m) => m.memUsage);

  const avg = (arr) => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
  const max = (arr) => Math.max(...arr).toFixed(1);
  const min = (arr) => Math.min(...arr).toFixed(1);

  const stats = [
    { label: 'CPU Avg', value: avg(cpuValues) + '%', color: '#22d3ee' },
    { label: 'CPU Max', value: max(cpuValues) + '%', color: '#f87171' },
    { label: 'CPU Min', value: min(cpuValues) + '%', color: '#34d399' },
    { label: 'Mem Avg', value: avg(memValues) + '%', color: '#a78bfa' },
    { label: 'Mem Max', value: max(memValues) + '%', color: '#fbbf24' },
    { label: 'Samples', value: metrics.length, color: 'var(--text-secondary)' },
  ];

  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '0.5px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '12px 20px',
      display: 'flex',
      gap: 0,
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      {stats.map((s, i) => (
        <React.Fragment key={s.label}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {s.label}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: s.color, fontFamily: 'var(--font-mono)' }}>
              {s.value}
            </div>
          </div>
          {i < stats.length - 1 && (
            <div style={{ width: 1, height: 30, background: 'var(--border)' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}