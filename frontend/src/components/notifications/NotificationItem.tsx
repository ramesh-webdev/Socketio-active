import React from 'react';
import { Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Notification } from '@/hooks/useNotifications';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

// BUG: This component re-renders even when props haven't changed

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead }) => {
  // BUG: Logs on every render - shows unnecessary re-renders
  console.log('[NotificationItem] Rendering:', notification.id);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getIcon = () => {
    if (notification.title.includes('Warning')) {
      return <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />;
    }
    if (notification.title.includes('Completed')) {
      return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success" />;
    }
    if (notification.title.includes('System')) {
      return <Info className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />;
    }
    return <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />;
  };

  return (
    <div
      className={cn(
        'p-3 sm:p-4 flex items-start gap-3 transition-colors cursor-pointer hover:bg-muted/50',
        !notification.read && 'bg-primary/5'
      )}
      onClick={() => !notification.read && onMarkAsRead(notification.id)}
    >
      <div className="mt-0.5 shrink-0">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className={cn('text-sm truncate', !notification.read && 'font-medium')}>
            {notification.title}
          </h4>
          {!notification.read && (
            <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
          )}
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <span className="text-xs text-muted-foreground mt-1 block">
          {formatTime(notification.timestamp)}
        </span>
      </div>
    </div>
  );
};

export default NotificationItem;
