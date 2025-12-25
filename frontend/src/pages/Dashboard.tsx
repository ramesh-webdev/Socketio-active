import React from 'react';
import { Users, Activity, AlertCircle, Clock } from 'lucide-react';
import { useStats } from '@/hooks/useStats';
import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';

// BUG: Dashboard re-renders excessively when stats update

const Dashboard: React.FC = () => {
  const { stats, lastUpdated } = useStats();

  // BUG: Logging shows excessive re-renders
  console.log('[Dashboard] Rendering, stats:', stats);

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your system metrics
          {lastUpdated && (
            <span className="block sm:inline sm:ml-2 text-xs">
              • Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={<Users className="w-5 h-5" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Requests / Min"
          value={stats.requestsPerMin}
          icon={<Activity className="w-5 h-5" />}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Error Rate"
          value={`${stats.errorRate}%`}
          icon={<AlertCircle className="w-5 h-5" />}
          trend={{ value: 0.3, isPositive: false }}
        />
        <StatCard
          title="Uptime"
          value={stats.uptime}
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ActivityFeed />
        
        <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
          <h3 className="font-medium mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">API Server</span>
              <span className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-success" />
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Database</span>
              <span className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-success" />
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cache Layer</span>
              <span className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-warning" />
                Degraded
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">CDN</span>
              <span className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-success" />
                Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
