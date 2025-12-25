import { useState, useEffect, useCallback } from 'react';
import { websocket } from '@/lib/websocket';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// BUG: This hook has issues with duplicate notifications and stale state

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount ?? 0);
        }
      } catch (e) {
        console.error('[useNotifications] fetch error', e);
      }
    };

    fetchNotifications();

    websocket.connect();

    const handleMessage = (data: any) => {
      if (data.type === 'notification') {
        setNotifications(prev => {
          // dedupe by id
          const exists = prev.some(n => n.id === data.id);
          if (exists) return prev;
          return [data, ...prev];
        });
        setUnreadCount(prev => prev + 1);
      }
    };

    websocket.subscribe(handleMessage);

    return () => {
      mounted = false;
      websocket.unsubscribe(handleMessage);
    };
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      if (res.ok) {
        const data = await res.json();
        setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
        setUnreadCount(prev => Math.max(0, prev - 1));
        return true;
      }
    } catch (e) {
      console.error('[useNotifications] markAsRead error', e);
    }
    return false;
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications/mark-all-read', { method: 'PATCH' });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
        return true;
      }
    } catch (e) {
      console.error('[useNotifications] markAllAsRead error', e);
    }
    return false;
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
  };
}
