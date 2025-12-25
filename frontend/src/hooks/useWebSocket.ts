import { useEffect, useState, useCallback } from 'react';
import { websocket } from '@/lib/websocket';

// BUG: This hook has intentional issues with cleanup and state management

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    websocket.connect();
    setIsConnected(true);

    const handleMessage = (data: any) => {
      // BUG: This creates a new reference each render, causing stale closure issues
      setLastMessage(data);
    };

    websocket.subscribe(handleMessage);

    // BUG: Cleanup doesn't always run properly due to strict mode double-invoke
    return () => {
      websocket.unsubscribe(handleMessage);
    };
  }, []); // BUG: Empty dependency array but uses external state

  const sendMessage = useCallback((message: any) => {
    console.log('[WS] Sending message:', message);
    // Simulated - no actual sending
  }, []);

  return { isConnected, lastMessage, sendMessage };
}
