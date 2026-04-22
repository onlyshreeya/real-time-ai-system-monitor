import React from 'react';

export default function PredictionPanel({ prediction }) {
  const { prediction: pred = 0, confidence = 0, alert = false, message = '', slope = 0, dataPoints = 0 } = prediction || {};

  const trendUp = slope > 0;
  const predColor = alert ? '#f87171' : pred > 40 ? '#fbbf24' : '#34d399';
  const displayMessage = alert
  ? "CPU load is increasing rapidly — consider reducing active processes"
  : "System performance is within normal operating range";

  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: `0.5px solid ${alert ? 'rgba(248,113,113,0.3)' : 'var(--border)'}`,
      borderRadius: 'var(--radius)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      transition: 'border-color 0.4s',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
      }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>
          Simulate Load
        </div>

        <button
          onClick={async () => {
            await fetch('http://localhost:5000/api/simulate', {
              method: 'POST'
            });
          }}
          title="Simulate CPU Spike"
          style={{
            padding: '4px 8px',
            borderRadius: 6,
            border: '0.5px solid #fbbf24',
            background: 'rgba(251,191,36,0.08)',
            color: '#fbbf24',
            fontSize: 10,
            cursor: 'pointer'
          }}
        >
          ⚡
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>AI Prediction</div>
        <div style={{
          fontSize: 10, padding: '3px 9px', borderRadius: 20,
          background: 'rgba(167,139,250,0.12)',
          border: '0.5px solid rgba(167,139,250,0.3)',
          color: '#a78bfa', fontFamily: 'var(--font-mono)',
        }}>
          LinearRegression
        </div>
      </div>

      {/* Big value */}
      <div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Next CPU value
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          <div style={{ fontSize: 48, fontWeight: 700, color: predColor, lineHeight: 1, fontFamily: 'var(--font-mono)', transition: 'color 0.4s' }}>
            {pred.toFixed(1)}
          </div>
          <div style={{ fontSize: 18, color: 'var(--text-secondary)', paddingBottom: 6, fontFamily: 'var(--font-mono)' }}>%</div>
          <div style={{ paddingBottom: 8, marginLeft: 4, fontSize: 18 }}>
            {trendUp ? '↑' : '↓'}
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
          Based on {dataPoints} recent data points · slope: {slope > 0 ? '+' : ''}{slope?.toFixed(3)}
        </div>
        <div style={{
          marginTop: 6,
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          color: trendUp ? '#f87171' : '#34d399'
        }}>
          {trendUp
            ? '↑ CPU usage is trending upward — may exceed safe limits soon'
            : '↓ System load is stabilizing — no immediate concerns'}
        </div>
      </div>

      {/* Confidence */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Model confidence</div>
          <div style={{ fontSize: 11, color: '#a78bfa', fontFamily: 'var(--font-mono)' }}>{confidence < 40
            ? `Low confidence (${confidence.toFixed(0)}%) — pattern is unstable`
            : confidence < 70
              ? `Moderate confidence (${confidence.toFixed(0)}%)`
              : `High confidence (${confidence.toFixed(0)}%) — reliable prediction`}%</div>
        </div>
        <div style={{ height: 4, background: 'rgba(167,139,250,0.12)', borderRadius: 2 }}>
          <div style={{
            height: '100%', width: `${confidence}%`,
            background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
            borderRadius: 2, transition: 'width 0.8s ease',
          }} />
        </div>
      </div>

      {/* Alert box */}
      <div style={{
        padding: '12px 14px',
        borderRadius: 8,
        border: `0.5px solid ${alert ? 'rgba(248,113,113,0.3)' : 'rgba(52,211,153,0.3)'}`,
        background: alert ? 'rgba(248,113,113,0.07)' : 'rgba(52,211,153,0.07)',
        transition: 'all 0.4s',
      }}>
        {prediction.anomaly && (
          <div style={{
            marginTop: 10,
            padding: '10px',
            borderRadius: 6,
            background: 'rgba(251,191,36,0.08)',
            border: '0.5px solid rgba(251,191,36,0.3)',
            color: '#fbbf24',
            fontSize: 11
          }}>
            ⚠ Sudden spike detected — {prediction.cause}
          </div>
        )}
        <div style={{
          
          fontSize: 12, fontWeight: 500, marginBottom: 4,
          color: alert ? '#f87171' : '#34d399',
        }}>
          {alert
            ? '⚠ System under increasing load'
            : '✓ System operating normally'}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {displayMessage}
        </div>
        {prediction.suggestion && (
          <div style={{
            marginTop: 8,
            padding: '10px',
            borderRadius: 6,
            background: 'rgba(34,211,238,0.08)',
            border: '0.5px solid rgba(34,211,238,0.3)',
            color: '#22d3ee',
            fontSize: 11
          }}>
            💡 {prediction.suggestion}
          </div>
        )}
      </div>
    </div>
  );
}