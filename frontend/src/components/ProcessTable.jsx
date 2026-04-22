import React from 'react';

// Static process list — replace with real /api/processes endpoint if you add one
const MOCK_PROCESSES = [
  { name: 'node', pid: 'server.js', cpu: null, mem: null, key: 'node' },
  { name: 'python3', pid: 'predict.py', cpu: null, mem: null, key: 'python3' },
  { name: 'mongod', pid: 'mongod', cpu: null, mem: null, key: 'mongod' },
  { name: 'nginx', pid: 'nginx', cpu: null, mem: null, key: 'nginx' },
  { name: 'vite', pid: 'frontend', cpu: null, mem: null, key: 'vite' },
];

export default function ProcessTable({ status }) {
  // Distribute total CPU across mock processes proportionally
  const cpu = status?.cpuUsage ?? 0;
  const mem = status?.memUsage ?? 0;

  const rows = [
    { ...MOCK_PROCESSES[0], cpu: (cpu * 0.3).toFixed(1), mem: (mem * 0.05).toFixed(1) },
    { ...MOCK_PROCESSES[1], cpu: (cpu * 0.15).toFixed(1), mem: (mem * 0.025).toFixed(1) },
    { ...MOCK_PROCESSES[2], cpu: (cpu * 0.1).toFixed(1), mem: (mem * 0.09).toFixed(1) },
    { ...MOCK_PROCESSES[3], cpu: (cpu * 0.05).toFixed(1), mem: (mem * 0.012).toFixed(1) },
    { ...MOCK_PROCESSES[4], cpu: (cpu * 0.08).toFixed(1), mem: (mem * 0.035).toFixed(1) },
  ];

  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '0.5px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '18px',
    }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 14 }}>
        Active Processes
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 100px 60px 60px',
        gap: '0 8px',
        fontSize: 10,
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: 8,
        paddingBottom: 8,
        borderBottom: '0.5px solid var(--border)',
      }}>
        <div>Process</div>
        <div>Module</div>
        <div style={{ textAlign: 'right' }}>CPU</div>
        <div style={{ textAlign: 'right' }}>MEM</div>
      </div>

      {rows.map((p) => (
        <div key={p.key} style={{
          display: 'grid',
          gridTemplateColumns: '1fr 100px 60px 60px',
          gap: '0 8px',
          padding: '8px 0',
          borderBottom: '0.5px solid var(--border)',
          alignItems: 'center',
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{p.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.pid}</div>
          <div style={{ fontSize: 12, color: '#22d3ee', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{p.cpu}%</div>
          <div style={{ fontSize: 12, color: '#a78bfa', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{p.mem}%</div>
        </div>
      ))}
    </div>
  );
}