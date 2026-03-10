import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Activity, ExternalLink, Zap } from 'lucide-react';
import { API_BASE_URL } from '../constants';

type Metric = { name: string; label: string; value: string };

const OpsPanel: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([
    { name: 'uptime', label: 'Network Integrity', value: 'CONNECTING...' },
    { name: 'avg_latency', label: 'Edge Latency', value: '32ms' },
    { name: 'error_rate', label: 'Fault Rate', value: '0.002% (NOMINAL)' },
  ]);

  const fetchLiveStatus = useCallback(async () => {
    try {
      const start = Date.now();
      const response = await fetch(`${API_BASE_URL}/status`);
      const latency = Date.now() - start;
      const data = await response.json() as any;

      setMetrics([
        { name: 'uptime', label: 'Network Integrity', value: data.status === 'STABLE' ? '99.998% (ACTIVE)' : 'DEGRADED' },
        { name: 'avg_latency', label: 'Edge Latency', value: `${latency}ms` },
        { name: 'error_rate', label: 'Fault Rate', value: '0.002% (NOMINAL)' },
      ]);
    } catch (e) {
      console.warn('Ops Node Offline');
    }
  }, []);

  useEffect(() => {
    fetchLiveStatus();
    const interval = setInterval(fetchLiveStatus, 15000);
    return () => clearInterval(interval);
  }, [fetchLiveStatus]);


  const grafanaUrl = useMemo(() => {
    const base = (window as any).__GRAFANA_PANEL_URL || 'https://play.grafana.org/d/000000012/grafana-play-home';
    const params = new URLSearchParams({
      orgId: '1',
      from: 'now-6h',
      to: 'now',
      theme: 'dark',
      kiosk: 'tv',
    });
    return `${base}?${params.toString()}`;
  }, []);

  return (
    <div className="bg-white/40 backdrop-blur-3xl rounded-[50px] border-2 border-slate-200 p-12 shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 geom-pattern opacity-[0.05] group-hover:opacity-[0.1] transition-opacity pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col sm:row justify-between items-start sm:items-center mb-10 gap-8">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 shadow-xl group-hover:rotate-12 transition-transform duration-500">
              <Zap className="w-8 h-8 text-[#FFD700]" />
            </div>
            <div>
              <h3 className="text-4xl font-black text-slate-800 uppercase tracking-tighter italic leading-none">System Pulse Hub</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mt-3 italic">Infrastructure Integrity // Global Edge</p>
            </div>
          </div>
          <a
            href={grafanaUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 px-8 py-4 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-black text-[#B3CEE5] uppercase tracking-widest hover:bg-[#FFD700] hover:text-slate-800 transition-all shadow-2xl active:scale-95 italic"
          >
            Master Console <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="relative rounded-[40px] overflow-hidden border-2 border-slate-200 shadow-2xl bg-black/40 p-2 group/frame">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1929]/20 to-transparent pointer-events-none z-10" />
          <iframe
            src={grafanaUrl}
            className="w-full h-80 rounded-[35px] border-none opacity-80 hover:opacity-100 transition-all duration-700"
            loading="lazy"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
          {metrics.map((m) => (
            <div key={m.name} className="bg-slate-100 hover:bg-white/[0.08] p-8 rounded-[35px] border border-slate-200 transition-all hover:scale-105 hover:shadow-2xl group/metric">
              <div className="flex items-center gap-3 mb-6">
                <Activity className={`w-4 h-4 ${m.name === 'uptime' ? 'text-emerald-500' : 'text-[#FFD700]'} animate-pulse`} />
                <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] italic group-hover/metric:text-slate-800 transition-colors">{m.label}</div>
              </div>
              <div className="text-3xl font-black text-slate-800 tracking-tighter italic font-mono flex items-baseline gap-3">
                {m.value}
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shadow-[0_0_12px_#10b981]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OpsPanel;
