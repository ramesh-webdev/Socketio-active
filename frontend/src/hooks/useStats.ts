import { useState, useEffect } from 'react';
import { websocket } from '@/lib/websocket';

export interface Stats {
  activeUsers: number;
  requestsPerMin: number;
  errorRate: string;
  uptime: string;
}

// BUG: Stats don't update immediately and have re-render issues

export function useStats() {
  const [stats, setStats] = useState<Stats>({
    activeUsers: 0,
    requestsPerMin: 0,
    errorRate: '0.00',
    uptime: '0%'
  });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          setStats({
            activeUsers: data.activeUsers ?? 0,
            requestsPerMin: data.requestsPerMin ?? 0,
            errorRate: String(data.errorRate ?? '0.00'),
            uptime: data.uptime ?? '0%'
          });
          setLastUpdated(data.timestamp ? new Date(data.timestamp) : new Date());
        }
      } catch (e) {
        console.error('[useStats] fetch error', e);
      }
    };

    fetchStats();

    websocket.connect();
    const handleMessage = (data: any) => {
      if (data.type === 'stats_update') {
        setStats(prev => ({
          ...prev,
          activeUsers: data.activeUsers ?? prev.activeUsers,
          requestsPerMin: data.requestsPerMin ?? prev.requestsPerMin,
          errorRate: String(data.errorRate ?? prev.errorRate),
          uptime: data.uptime ?? prev.uptime,
        }));
        setLastUpdated(new Date());
      }
    };

    websocket.subscribe(handleMessage);

    return () => {
      mounted = false;
      websocket.unsubscribe(handleMessage);
    };
  }, []); // Empty deps means stale closure

  return { stats, lastUpdated };
}
