import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, Filler, Tooltip, Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function CPUChart({ metrics, prediction }) {
  const labels = metrics.map((m) =>
    new Date(m.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  // Add a predicted point just ahead of real data
  const predLabel = 'next';
  const allLabels = [...labels, predLabel];

  const cpuData = metrics.map((m) => m.cpuUsage);
  const memData = metrics.map((m) => m.memUsage);
  const predData = [...Array(metrics.length).fill(null), prediction?.prediction ?? null];
  const getAnomalyCause = (cpu, mem, net) => {
    if (cpu > 85 && mem < 70) return "High CPU — background processes spike";
    if (cpu > 85 && mem > 80) return "High CPU + Memory — heavy application load";
    if (mem > 90) return "Memory saturation — possible leak or heavy usage";
    if (net > 0.1) return "Network surge — high data transfer detected";
    return "Unusual system behavior detected";
  };

  const data = {
    labels: allLabels,
    datasets: [
      {
        label: 'CPU %',
        data: [...cpuData, null],
        borderColor: '#22d3ee',
        backgroundColor: 'rgba(34,211,238,0.07)',
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Memory %',
        data: [...memData, null],
        borderColor: '#a78bfa',
        backgroundColor: 'rgba(167,139,250,0.04)',
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.3,
        fill: true,
      },
      {
        label: 'AI Prediction',
        data: predData,
        borderColor: '#fbbf24',
        borderDash: [5, 4],
        borderWidth: 2,
        pointRadius: predData.map((v, i) => (i === predData.length - 1 && v !== null ? 6 : 0)),
        pointBackgroundColor: '#fbbf24',
        tension: 0,
        fill: false,
      },
      {
        label: 'Anomaly',
        data: metrics.map((m, i) => {
          if (i < 5) return null;

          const slice = metrics.slice(i - 5, i).map(x => x.cpuUsage);
          const avg = slice.reduce((a, b) => a + b, 0) / slice.length;

          return (m.cpuUsage > avg + 15 && m.cpuUsage > 50)
            ? m.cpuUsage
            : null;
        }),
        borderColor: 'transparent',
        backgroundColor: '#f87171',
        pointRadius: (ctx) => ctx.raw ? 5 : 0,
        pointHoverRadius: 7,
        showLine: false,
        pointBackgroundColor: '#f87171',
        pointBorderColor: '#f87171',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#ff4d4f',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 350 },
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#8b949e',
          font: { family: 'JetBrains Mono', size: 11 },
          boxWidth: 12,
          padding: 14,
        },
      },
      tooltip: {
        backgroundColor: '#161b22',
        borderColor: '#30363d',
        borderWidth: 1,
        titleColor: '#8b949e',
        bodyColor: '#e6edf3',
        titleFont: { family: 'JetBrains Mono', size: 11 },
        bodyFont: { family: 'JetBrains Mono', size: 12 },
        callbacks: {
          label: (ctx) => {
            const value = ctx.parsed.y;

            // 🚫 Hide default anomaly label
            if (ctx.dataset.label === 'Anomaly') return null;

            return ` ${ctx.dataset.label}: ${value?.toFixed(1) ?? '—'}%`;
          },

          afterBody: (items) => {
            const index = items[0].dataIndex;

            const cpu = cpuData[index];
            const mem = memData[index];
            const net = metrics[index]?.networkRx || 0;

            const isAnomaly = items.some(i => i.dataset.label === 'Anomaly' && i.raw);

            if (isAnomaly) {
              return `🔥 ${getAnomalyCause(cpu, mem, net)}\n💡 Monitor background processes`;
            }

            return null;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        ticks: {
          color: '#484f58',
          font: { family: 'JetBrains Mono', size: 9 },
          maxTicksLimit: 6,
          maxRotation: 0,
        },
        grid: { color: 'rgba(255,255,255,0.03)' },
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          color: '#484f58',
          font: { family: 'JetBrains Mono', size: 11 },
          callback: (v) => v + '%',
          stepSize: 25,
        },
        grid: { color: 'rgba(255,255,255,0.04)' },
      },
    },
  };

  return (
    <div style={{ position: 'relative', height: 240 }}>
      <Line data={data} options={options} />
    </div>
  );
}