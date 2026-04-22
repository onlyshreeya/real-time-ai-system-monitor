import React from 'react';

const typeStyle = {
  ok:    { dot: '#34d399', label: 'OK' },
  info:  { dot: '#22d3ee', label: 'INFO' },
  warn:  { dot: '#fbbf24', label: 'WARN' },
  error: { dot: '#f87171', label: 'ERR' },
};

export default function EventLog({ logs }) {
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '0.5px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Event Log</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 280, overflowY: 'auto' }}>
        {logs.length === 0 && (
          <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '12px 0', fontFamily: 'var(--font-mono)' }}>
            Waiting for events...
          </div>
        )}
        {logs.map((log) => {
          const s = typeStyle[log.type] || typeStyle.info;
          return (
            <div key={log.id} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '8px 10px',
              background: 'var(--bg-surface)',
              borderRadius: 6,
              border: '0.5px solid var(--border)',
              animation: 'fadeIn 0.3s ease',
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: s.dot, flexShrink: 0, marginTop: 4,
              }} />
              <div style={{ flex: 1 }}>
                <span style={{
                  fontSize: 10, fontFamily: 'var(--font-mono)',
                  color: s.dot, marginRight: 6,
                }}>{s.label}</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{log.message}</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                {log.time}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:none; } }`}</style>
    </div>
  );
}