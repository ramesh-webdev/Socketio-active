import React, { useEffect, useState } from 'react';
import { websocket } from '@/lib/websocket';

interface Activity {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
}

// BUG: This component has memory leak - event listener not cleaned up properly

const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    let mounted = true;

    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/activity?limit=20');
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          setActivities(data.activities || []);
        }
      } catch (e) {
        console.error('[ActivityFeed] fetch error', e);
      }
    };

    fetchActivities();

    const handleMessage = (data: any) => {
      if (data.type === 'user_activity') {
        setActivities(prev => {
          const newItem = {
            id: data.id || `activity-${Date.now()}`,
            userId: data.userId,
            action: data.action,
            timestamp: data.timestamp || new Date().toISOString(),
          };
          // dedupe by id
          if (prev.some(a => a.id === newItem.id)) return prev;
          const next = [newItem, ...prev].slice(0, 50); // keep max 50
          return next;
        });
      }
    };

    websocket.subscribe(handleMessage);

    return () => {
      mounted = false;
      websocket.unsubscribe(handleMessage);
    };
  }, []); // BUG: Empty dependency array

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${Math.floor(diffMins / 60)}h ago`;
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      login: 'logged in',
      logout: 'logged out',
      update: 'updated profile',
      view: 'viewed dashboard',
    };
    return labels[action] || action;
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-3 sm:p-4 border-b border-border">
        <h3 className="font-medium text-sm sm:text-base">Recent Activity</h3>
      </div>
      <div className="divide-y divide-border max-h-64 sm:max-h-80 overflow-auto">
        {activities.slice(0, 10).map(activity => (
          <div key={activity.id} className="p-3 sm:p-4 flex items-center gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
              {activity.userId.split('-')[1]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm truncate">
                <span className="font-medium">{activity.userId}</span>{' '}
                <span className="text-muted-foreground">{getActionLabel(activity.action)}</span>
              </p>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{formatTime(activity.timestamp)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
