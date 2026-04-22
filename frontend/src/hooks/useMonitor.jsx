import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL + '/api';
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

const DEFAULT_STATUS = {
  cpuUsage: 0, memUsage: 0, diskUsage: 0,
  networkRx: 0, networkTx: 0,
  uptime: 0, healthy: true, dbRecords: 0,
};

const DEFAULT_PREDICTION = {
  prediction: 0, confidence: 0,
  alert: false, message: 'Loading...', cpuValues: [],
};

export function useMonitor(intervalMs = 3000) {
  const lastAlertRef = useRef(false);

  const [status, setStatus] = useState(DEFAULT_STATUS);
  const [prediction, setPrediction] = useState(DEFAULT_PREDICTION);
  const [metrics, setMetrics] = useState([]);
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]); // ✅ FIXED
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  const logIdRef = useRef(0);

  const addLog = useCallback((type, message) => {
    const id = ++logIdRef.current;
    setLogs(prev => [{
      id,
      type,
      message,
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
    }, ...prev].slice(0, 20));
  }, []);

  const fetchAll = useCallback(async () => {
    try {
      const [statusRes, predictRes, metricsRes] = await Promise.all([
        fetch(`${API}/status`),
        fetch(`${API}/predict?points=30`),
        fetch(`${API}/metrics?limit=60&minutes=5`),
      ]);

      if (!statusRes.ok || !predictRes.ok) throw new Error('API error');

      const [statusData, predictData, metricsData] = await Promise.all([
        statusRes.json(),
        predictRes.json(),
        metricsRes.json(),
      ]);

      // ================= STATUS =================
      if (statusData.success) {
        const prev = status.cpuUsage;
        setStatus(statusData.data);

        if (!connected) {
          setConnected(true);
          addLog('ok', 'Connected to monitoring backend');
        }

        const diff = statusData.data.cpuUsage - prev;
        if (Math.abs(diff) > 5) {
          addLog('info', `CPU ${diff > 0 ? 'spike' : 'drop'}: ${statusData.data.cpuUsage.toFixed(1)}%`);
        }
      }

      // ================= PREDICTION =================
      if (predictData.success) {
        const data = predictData.data;
        setPrediction(data);

        const isAlert = data.alert;
        const isAnomaly = data.anomaly;
        const cause = data.cause;
        const { prediction: predValue, slope } = data;

        if (isAlert && !lastAlertRef.current) {
          let severity = "info";
          let message = "";

          if (predValue > 85) {
            severity = "error";
            message = `🔥 CRITICAL: CPU ${predValue.toFixed(1)}% — system overload imminent`;
          } else if (predValue > 70) {
            severity = "warning";
            message = `⚠ High load (${predValue.toFixed(1)}%) — reduce processes`;
          } else {
            severity = "info";
            message = `🧠 Moderate load (${predValue.toFixed(1)}%) — monitoring closely`;
          }

          const trend = slope > 0 ? "↑ Increasing" : "↓ Decreasing";

          // 🔴 SAVE ALERT
          setAlerts(prev => [
            {
              id: Date.now(),
              message: `${message} (${trend})`,
              severity,
              time: new Date().toLocaleTimeString(),
            },
            ...prev
          ].slice(0, 20));

          addLog('warn', `${message} (${trend})`);

          const styles = {
            error: {
              border: "1px solid #ff4d4f",
              boxShadow: "0 0 14px rgba(255,77,79,0.5)"
            },
            warning: {
              border: "1px solid #fbbf24",
              boxShadow: "0 0 14px rgba(251,191,36,0.5)"
            },
            info: {
              border: "1px solid #22c55e",
              boxShadow: "0 0 14px rgba(34,197,94,0.5)"
            }
          };

          toast[severity](`${message} (${trend})`, {
            style: styles[severity]
          });

          // 🟡 ANOMALY ALERT
          if (isAnomaly && cause) {
            setAlerts(prev => [
              {
                id: Date.now() + 1,
                message: cause,
                severity: "warning",
                time: new Date().toLocaleTimeString(),
              },
              ...prev
            ].slice(0, 20));

            toast.warning(`⚠ ${cause}`, {
              style: {
                border: "1px solid #fbbf24",
                boxShadow: "0 0 14px rgba(251,191,36,0.5)"
              }
            });

            addLog("warn", cause);
          }
        }

        lastAlertRef.current = isAlert;
      }

      // ================= METRICS =================
      if (metricsData.success) {
        setMetrics(metricsData.data);
        addLog('ok', `Metrics synced — ${metricsData.data.length} records`);
      }

      setError(null);

    } catch (err) {
      setConnected(false);
      setError(err.message);
      addLog('error', `Connection failed: ${err.message}`);
    }
  }, [connected, status.cpuUsage, addLog]);

  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  

  return {
    status,
    prediction,
    metrics,
    logs,
    alerts, // ✅ IMPORTANT
    connected,
    error,
    refetch: fetchAll
  };
}