import React from 'react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationItem from '@/components/notifications/NotificationItem';

// BUG: This page has duplicate notification issues and inconsistent state

const Notifications: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();

  // BUG: Logs show the component re-renders excessively
  console.log('[Notifications] Rendering, count:', notifications.length, 'unread:', unreadCount);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex-1 sm:flex-none"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Mark all read</span>
            <span className="sm:hidden">Read all</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAll}
            disabled={notifications.length === 0}
            className="flex-1 sm:flex-none"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Clear all</span>
            <span className="sm:hidden">Clear</span>
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <Bell className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No notifications yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              New notifications will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
              />
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};

export default Notifications;
