import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function NetworkChart({ metrics }) {
  const last20 = metrics.slice(-20);
  const labels = last20.map((m) =>
    new Date(m.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'RX (MB/s)',
        data: last20.map((m) => m.networkRx ?? 0),
        backgroundColor: 'rgba(34,211,238,0.5)',
        borderRadius: 3,
      },
      {
        label: 'TX (MB/s)',
        data: last20.map((m) => m.networkTx ?? 0),
        backgroundColor: 'rgba(167,139,250,0.5)',
        borderRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    plugins: {
      legend: {
        display: true,
        labels: { color: '#8b949e', font: { family: 'JetBrains Mono', size: 11 }, boxWidth: 10, padding: 12 },
      },
      tooltip: {
        backgroundColor: '#161b22',
        borderColor: '#30363d',
        borderWidth: 1,
        titleColor: '#8b949e',
        bodyColor: '#e6edf3',
        titleFont: { family: 'JetBrains Mono', size: 11 },
        bodyFont: { family: 'JetBrains Mono', size: 12 },
        callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y?.toFixed(3)} MB/s` },
      },
    },
    scales: {
      x: { display: false },
      y: {
        min: 0,
        ticks: { color: '#484f58', font: { family: 'JetBrains Mono', size: 11 }, callback: (v) => v.toFixed(1) + ' MB/s' },
        grid: { color: 'rgba(255,255,255,0.04)' },
      },
    },
  };

  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '0.5px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '18px',
    }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 14 }}>
        Network I/O
      </div>
      <div style={{ position: 'relative', height: 140 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}