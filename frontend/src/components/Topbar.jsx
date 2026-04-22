import React, { useState, useEffect } from 'react';

export default function Topbar({ status, connected }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const uptime = status?.uptime ?? 0;
  const uptimeStr = uptime > 3600
    ? `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`
    : `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`;

  const isHealthy = status?.healthy ?? true;
  const isHighLoad = (status?.cpuUsage ?? 0) > 70 || (status?.memUsage ?? 0) > 90;

  return (
    <div style={{
      background: 'var(--bg-base)',
      borderBottom: '0.5px solid var(--border)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
      zIndex: 10,
    }}>
      {/* Left: logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 30, height: 30,
          background: 'linear-gradient(135deg, #22d3ee, #a78bfa)',
          borderRadius: 8, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 14,
        }}>⚡</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            AI System Monitor
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            uptime {uptimeStr}
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(34,211,238,0.08)',
          border: '0.5px solid rgba(34,211,238,0.2)',
          borderRadius: 20, padding: '4px 12px',
          fontSize: 11, color: '#22d3ee',
          marginLeft: 8,
        }}>
          <div style={{
            width: 5, height: 5, borderRadius: '50%', background: '#22d3ee',
            animation: connected ? 'pulse 1.4s infinite' : 'none',
          }} />
          {connected ? 'Live' : 'Offline'}
        </div>
      </div>

      {/* Right: status + clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          fontSize: 11, padding: '4px 12px', borderRadius: 20,
          border: '0.5px solid',
          ...(isHighLoad
            ? { background: 'rgba(248,113,113,0.08)', borderColor: 'rgba(248,113,113,0.3)', color: '#f87171' }
            : isHealthy
              ? { background: 'rgba(52,211,153,0.08)', borderColor: 'rgba(52,211,153,0.3)', color: '#34d399' }
              : { background: 'rgba(251,191,36,0.08)', borderColor: 'rgba(251,191,36,0.3)', color: '#fbbf24' }
          ),
          fontFamily: 'var(--font-mono)',
          transition: 'all 0.4s',
        }}>
          {isHighLoad ? '⚠ High Load' : isHealthy ? '✓ Healthy' : '~ Degraded'}
        </div>

        <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {time.toLocaleTimeString('en-US', { hour12: false })}
        </div>

        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {status?.dbRecords ?? 0} records
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}