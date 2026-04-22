import React from 'react';

const COLORS = {
  error: '#f87171',
  warning: '#fbbf24',
  info: '#34d399',
};

const ICONS = {
  error: '🔥',
  warning: '⚠',
  info: '🧠',
};

export default function AlertHistory({ alerts = [] }) {
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '0.5px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '18px',
    }}>
      {/* Header */}
      <div style={{
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--text-primary)',
        marginBottom: 10
      }}>
        Alert History
      </div>

      <div style={{
        fontSize: 11,
        color: 'var(--text-muted)',
        marginBottom: 12,
        fontFamily: 'var(--font-mono)'
      }}>
        Showing last {alerts.length} alerts
      </div>

      {/* Empty state */}
      {alerts.length === 0 && (
        <div style={{
          padding: '12px',
          borderRadius: 8,
          border: '0.5px dashed var(--border)',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: 12,
        }}>
          No alerts yet 💤 system calm...
        </div>
      )}

      {/* Alerts list */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}>
        {alerts.map(alert => (
          <div
            key={alert.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 12px',
              borderRadius: 8,
              border: `0.5px solid ${COLORS[alert.severity]}33`,
              background: `${COLORS[alert.severity]}11`,
              transition: 'all 0.3s',
            }}
          >
            {/* Left */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                fontSize: 14,
              }}>
                {ICONS[alert.severity]}
              </div>

              <div style={{
                fontSize: 12,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
              }}>
                {alert.message}
              </div>
            </div>

            {/* Right time */}
            <div style={{
              fontSize: 10,
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)'
            }}>
              {alert.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}