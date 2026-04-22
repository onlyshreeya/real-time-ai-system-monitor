import React from 'react';

const NAV = [
  { section: 'Overview' },
  { id: 'dashboard', icon: '▣', label: 'Dashboard' },
  { id: 'metrics', icon: '◈', label: 'Metrics' },
  { id: 'predict', icon: '◎', label: 'AI Predictions' },
  { section: 'System' },
  { id: 'processes', icon: '⊞', label: 'Processes' },
  { id: 'network', icon: '◉', label: 'Network' },
  { id: 'storage', icon: '◫', label: 'Storage' },
  { section: 'Config' },
  { id: 'alerts', icon: '◬', label: 'Alerts' },
  { id: 'settings', icon: '◌', label: 'Settings' },
];

export default function Sidebar({ active, onNav, connected }) {
  return (
    <div style={{
      width: 220,
      background: 'var(--bg-surface)',
      borderRight: '0.5px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 0',
      flexShrink: 0,
    }}>
      {/* Connection indicator */}
      <div style={{
        margin: '0 12px 16px',
        padding: '8px 12px',
        borderRadius: 'var(--radius-sm)',
        background: connected ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
        border: `0.5px solid ${connected ? 'rgba(52,211,153,0.25)' : 'rgba(248,113,113,0.25)'}`,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 11,
        color: connected ? '#34d399' : '#f87171',
        fontFamily: 'var(--font-mono)',
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: connected ? '#34d399' : '#f87171',
          animation: connected ? 'pulse 1.5s infinite' : 'none',
        }} />
        {connected ? 'Backend Connected' : 'Disconnected'}
      </div>

      {NAV.map((item, i) => {
        if (item.section) {
          return (
            <div key={i} style={{
              fontSize: 9, fontWeight: 500, color: 'var(--text-muted)',
              padding: '14px 16px 6px',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              fontFamily: 'var(--font-mono)',
            }}>
              {item.section}
            </div>
          );
        }
        const isActive = active === item.id;
        return (
          <div key={item.id} onClick={() => onNav(item.id)} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 16px',
            fontSize: 13, fontWeight: 500,
            color: isActive ? '#22d3ee' : 'var(--text-secondary)',
            background: isActive ? 'rgba(34,211,238,0.07)' : 'transparent',
            borderLeft: `2px solid ${isActive ? '#22d3ee' : 'transparent'}`,
            cursor: 'pointer',
            transition: 'all 0.15s',
            userSelect: 'none',
          }}>
            <span style={{ fontSize: 12, opacity: 0.8 }}>{item.icon}</span>
            {item.label}
          </div>
        );
      })}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}