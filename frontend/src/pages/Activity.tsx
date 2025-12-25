import React from 'react';
import { Activity as ActivityIcon } from 'lucide-react';
import ActivityFeed from '@/components/dashboard/ActivityFeed';

const Activity: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Activity Log</h1>
        <p className="text-muted-foreground mt-1">
          Real-time user activity across the system
        </p>
      </div>

      <div className="max-w-2xl">
        <ActivityFeed />
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-start gap-3">
          <ActivityIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Activity Tracking</p>
            <p className="text-sm text-muted-foreground mt-1">
              This feed updates in real-time as users interact with the system.
              Note: You may see duplicate entries or delayed updates due to known sync issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;
