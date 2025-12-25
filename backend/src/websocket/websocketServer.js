import { WebSocketServer } from 'ws';

export const setupWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  const clients = new Map();

  wss.on('connection', (ws) => {
    console.log('🔌 WebSocket client connected');
    clients.set(ws, {});

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);

        if (message.type === 'auth') {
          // Store user info
          clients.set(ws, {
            userId: message.userId,
            email: message.email,
          });
          ws.send(
            JSON.stringify({
              type: 'auth_success',
              message: 'Authentication successful',
            })
          );
        }

        // Broadcast to specific user
        if (message.type === 'broadcast') {
          broadcastToUser(message.userId, {
            type: message.messageType,
            data: message.data,
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
      console.log('❌ WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // Simulate stats updates every 5 seconds
  setInterval(() => {
    const stats = {
      activeUsers: Math.floor(Math.random() * 100 + 100),
      requestsPerMin: Math.floor(Math.random() * 50 + 50),
      errorRate: (Math.random() * 0.5).toFixed(2),
      uptime: '99.9%',
    };

    broadcastToAll({
      type: 'stats_update',
      ...stats,
      timestamp: new Date().toISOString(),
    });
  }, 5000);

  // Simulate notifications every 10 seconds
  setInterval(() => {
    const notifications = [
      {
        id: Math.random().toString(36).substr(2, 9),
        title: 'System Update',
        message: 'System maintenance scheduled for tonight',
        timestamp: new Date().toISOString(),
        read: false,
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        title: 'New Activity',
        message: 'User login detected from new location',
        timestamp: new Date().toISOString(),
        read: false,
      },
    ];

    broadcastToAll({
      type: 'notification',
      data: notifications[Math.floor(Math.random() * notifications.length)],
    });
  }, 10000);

  const broadcastToAll = (message) => {
    const data = JSON.stringify(message);
    clients.forEach((_, ws) => {
      if (ws.readyState === 1) { // OPEN = 1
        ws.send(data);
      }
    });
  };

  const broadcastToUser = (userId, message) => {
    const data = JSON.stringify(message);
    clients.forEach((client, ws) => {
      if (client.userId === userId && ws.readyState === 1) { // OPEN = 1
        ws.send(data);
      }
    });
  };

  return wss;
};
