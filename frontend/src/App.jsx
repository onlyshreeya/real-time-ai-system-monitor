import React, { useState } from 'react';
import { useMonitor } from './hooks/useMonitor';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import MetricCard from './components/MetricCard';
import CPUChart from './components/CPUChart';
import PredictionPanel from './components/PredictionPanel';
import EventLog from './components/EventLog';
import ProcessTable from './components/ProcessTable';
import NetworkChart from './components/NetworkChart';
import StatsRow from './components/StatsRow';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AlertHistory from './components/AlertHistory';

const REFRESH_MS = 3000;

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const { status, prediction, metrics, logs, alerts, connected, error } = useMonitor(REFRESH_MS);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-base)', overflow: 'hidden' }}>
      <Topbar status={status} connected={connected} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar active={activePage} onNav={setActivePage} connected={connected} />

        <main style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Error banner */}
          {error && (
            <div style={{
              padding: '10px 16px',
              background: 'rgba(248,113,113,0.08)',
              border: '0.5px solid rgba(248,113,113,0.3)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 12, color: '#f87171',
              fontFamily: 'var(--font-mono)',
            }}>
              ⚠ {error} — Is your backend running on port 5000?
            </div>
          )}

          {/* Page: Dashboard */}
          {activePage === 'dashboard' && (
            <>
              {/* Metric cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
                <MetricCard label="CPU Usage" value={status.cpuUsage?.toFixed(1)} color="blue" icon="⚙" />
                <MetricCard label="Memory" value={status.memUsage?.toFixed(1)} color="purple" icon="◈" />
                <MetricCard label="Disk I/O" value={status.diskUsage?.toFixed(1)} color="green" icon="◫" />
                <MetricCard
                  label="Network RX"
                  value={(status.networkRx ?? 0).toFixed(2)}
                  unit=" MB/s"
                  color="orange"
                  icon="◉"
                  pct={Math.min(100, (status.networkRx ?? 0) * 20)}
                />
              </div>

              {/* Stats summary */}
              <StatsRow metrics={metrics} />

              {/* Chart + Prediction */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14 }}>
                <div style={{
                  background: 'var(--bg-elevated)',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '18px',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 16 }}>
                    CPU &amp; Memory Activity
                  </div>
                  <CPUChart metrics={metrics} prediction={prediction} />
                </div>
                <PredictionPanel prediction={prediction} />
              </div>

              {/* Bottom row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <EventLog logs={logs} />
                <ProcessTable status={status} />
              </div>
            </>
          )}

          {/* Page: Metrics */}
          {activePage === 'metrics' && (
            <>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Metrics</div>
              <StatsRow metrics={metrics} />
              <div style={{
                background: 'var(--bg-elevated)',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '18px',
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 16 }}>
                  Historical CPU &amp; Memory
                </div>
                <CPUChart metrics={metrics} prediction={prediction} />
              </div>
              <NetworkChart metrics={metrics} />
              {/* Raw table */}
              <div style={{
                background: 'var(--bg-elevated)',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '18px',
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 14 }}>Raw Data</div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                    <thead>
                      <tr>
                        {['Timestamp', 'CPU %', 'Memory %', 'Disk %', 'RX MB/s', 'TX MB/s'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '6px 12px', color: 'var(--text-muted)', borderBottom: '0.5px solid var(--border)', fontWeight: 400 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...metrics].reverse().slice(0, 20).map((m, i) => (
                        <tr key={i} style={{ borderBottom: '0.5px solid var(--border)' }}>
                          <td style={{ padding: '6px 12px', color: 'var(--text-muted)' }}>{new Date(m.timestamp).toLocaleTimeString()}</td>
                          <td style={{ padding: '6px 12px', color: '#22d3ee' }}>{m.cpuUsage?.toFixed(2)}</td>
                          <td style={{ padding: '6px 12px', color: '#a78bfa' }}>{m.memUsage?.toFixed(2)}</td>
                          <td style={{ padding: '6px 12px', color: '#34d399' }}>{m.diskUsage?.toFixed(2)}</td>
                          <td style={{ padding: '6px 12px', color: '#fb923c' }}>{m.networkRx?.toFixed(3)}</td>
                          <td style={{ padding: '6px 12px', color: '#fbbf24' }}>{m.networkTx?.toFixed(3)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Page: AI Predictions */}
          {activePage === 'predict' && (
            <>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>AI Predictions</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14 }}>
                <div style={{
                  background: 'var(--bg-elevated)',
                  border: '0.5px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '18px',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>Trend with Prediction</div>
                  <CPUChart metrics={metrics} prediction={prediction} />
                </div>
                <PredictionPanel prediction={prediction} />
              </div>
              <div style={{
                background: 'var(--bg-elevated)',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '20px',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 12 }}>Model Info</div>
                <div>Algorithm: <span style={{ color: '#22d3ee' }}>Linear Regression (sklearn)</span></div>
                <div>Features: <span style={{ color: '#a78bfa' }}>Time-indexed CPU values</span></div>
                <div>Input window: <span style={{ color: '#34d399' }}>{prediction?.dataPoints ?? 0} points</span></div>
                <div>Threshold: <span style={{ color: '#f87171' }}>60% CPU → alert</span></div>
                <div>Slope: <span style={{ color: '#fbbf24' }}>{prediction?.slope ?? 0}</span></div>
                <div>Intercept: <span style={{ color: '#fb923c' }}>{prediction?.intercept ?? 0}</span></div>
              </div>
            </>
          )}

          {/* Page: Processes */}
          {activePage === 'processes' && (
            <>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Processes</div>
              <ProcessTable status={status} />
            </>
          )}

          {/* Page: Network */}
          {activePage === 'network' && (
            <>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Network</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <MetricCard label="RX Speed" value={(status.networkRx ?? 0).toFixed(2)} unit=" MB/s" color="blue" icon="↓" pct={Math.min(100, (status.networkRx ?? 0) * 20)} />
                <MetricCard label="TX Speed" value={(status.networkTx ?? 0).toFixed(2)} unit=" MB/s" color="purple" icon="↑" pct={Math.min(100, (status.networkTx ?? 0) * 20)} />
              </div>
              <NetworkChart metrics={metrics} />
            </>
          )}

          {/* Page: Storage */}
          {activePage === 'storage' && (
            <>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>
                Storage
              </div>

              {/* Existing Disk Card */}
              <MetricCard
                title="Disk Usage"
                value={status.diskUsage}
                unit="%"
                accent="#34d399"
              />

              {/* 🧠 Insight */}
              <div
                style={{
                  marginTop: 12,
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(34,211,238,0.05)',
                  border: '0.5px solid var(--border)',
                  fontSize: 12,
                  color: 'var(--text-secondary)'
                }}
              >
                {status.diskUsage > 85
                  ? "🔥 Critical: Storage almost full — cleanup needed"
                  : status.diskUsage > 70
                    ? "⚠ Storage getting high — consider cleanup"
                    : "✅ Storage usage is healthy"}
              </div>

              {/* 📦 Top Consumers */}
              <div style={{
                marginTop: 20,
                padding: 16,
                borderRadius: 'var(--radius)',
                background: 'var(--bg-elevated)',
                border: '0.5px solid var(--border)'
              }}>
                <div style={{
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 10,
                  color: 'var(--text-primary)'
                }}>
                  Top Storage Consumers
                </div>

                {[
                  { name: "Node Modules", size: "3.2 GB" },
                  { name: "Chrome Cache", size: "2.1 GB" },
                  { name: "VS Code", size: "1.4 GB" },
                  { name: "Downloads", size: "4.8 GB" },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    padding: '6px 0',
                    color: 'var(--text-secondary)'
                  }}>
                    <span>{item.name}</span>
                    <span>{item.size}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Page: Alerts */}
          {activePage === 'alerts' && (
            <>
              {/* Title */}
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
                Alerts
              </div>

              {/* 🔴 REAL ALERT HISTORY */}
              <AlertHistory alerts={alerts} />

              {/* 📘 ALERT RULES PANEL */}
              <div style={{
                marginTop: 16,
                background: 'var(--bg-elevated)',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '18px',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
              }}>
                <div style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  marginBottom: 8
                }}>
                  Alert Conditions
                </div>

                <div>
                  CPU Prediction &gt; <span style={{ color: '#f87171' }}>60%</span> → High Load
                </div>
                <div>
                  Memory &gt; <span style={{ color: '#f87171' }}>90%</span> → Memory Critical
                </div>
                <div>
                  Disk &gt; <span style={{ color: '#fbbf24' }}>80%</span> → Disk Warning
                </div>
              </div>
            </>
          )}

          {/* Page: Settings */}
          {activePage === 'settings' && (
            <>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Settings</div>
              <div style={{
                background: 'var(--bg-elevated)',
                border: '0.5px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '20px',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--text-secondary)',
                lineHeight: 2,
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 12 }}>Configuration</div>
                <div>Backend URL: <span style={{ color: '#22d3ee' }}>http://localhost:5000</span></div>
                <div>Poll interval: <span style={{ color: '#22d3ee' }}>{REFRESH_MS}ms</span></div>
                <div>Prediction window: <span style={{ color: '#22d3ee' }}>30 points</span></div>
                <div>Alert threshold: <span style={{ color: '#f87171' }}>60% CPU</span></div>
                <div>Data retention: <span style={{ color: '#22d3ee' }}>24 hours (TTL index)</span></div>
                <div style={{ marginTop: 16, color: 'var(--text-muted)', fontSize: 11 }}>
                  Edit thresholds in backend/.env → PREDICTION_THRESHOLD
                </div>
              </div>
            </>

          )}
        </main>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        theme="dark"
        toastStyle={{
          background: "#0f172a",
          color: "#e2e8f0",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(0,0,0,0.6)"
        }}
      />
    </div>


  );
}