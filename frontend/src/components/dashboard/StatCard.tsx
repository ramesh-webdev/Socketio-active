import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

// BUG: This component doesn't use React.memo, causing unnecessary re-renders
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, className }) => {
  // BUG: Logging shows this renders more than necessary
  console.log('[StatCard] Rendering:', title);

  return (
    <div className={cn('bg-card rounded-lg border border-border p-6', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          {trend && (
            <p
              className={cn(
                'text-sm mt-2',
                trend.isPositive ? 'text-success' : 'text-destructive'
              )}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-lg text-primary">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
