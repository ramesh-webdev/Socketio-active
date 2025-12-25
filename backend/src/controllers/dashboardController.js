import { Stats } from '../models/Stats.js';

export const getStats = async (req, res) => {
  try {
    // Get the latest stats
    const stats = await Stats.findOne().sort({ timestamp: -1 });

    if (!stats) {
      // Return default stats if none exist
      return res.json({
        activeUsers: 127,
        requestsPerMin: 89,
        errorRate: 0.42,
        uptime: '99.9%',
        serverStatus: {
          apiServer: 'operational',
          database: 'operational',
          cacheLayer: 'degraded',
          cdn: 'operational',
        },
      });
    }

    res.json({
      activeUsers: stats.activeUsers,
      requestsPerMin: stats.requestsPerMin,
      errorRate: stats.errorRate,
      uptime: stats.uptime,
      serverStatus: stats.serverStatus,
      timestamp: stats.timestamp,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error });
  }
};

export const getSystemStatus = async (req, res) => {
  try {
    const stats = await Stats.findOne().sort({ timestamp: -1 });

    const status = stats?.serverStatus || {
      apiServer: 'operational',
      database: 'operational',
      cacheLayer: 'degraded',
      cdn: 'operational',
    };

    res.json(status);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching system status', error });
  }
};

export const updateStats = async (req, res) => {
  try {
    const { activeUsers, requestsPerMin, errorRate, uptime } = req.body;

    const stats = new Stats({
      activeUsers: activeUsers || 127,
      requestsPerMin: requestsPerMin || 89,
      errorRate: errorRate || 0.42,
      uptime: uptime || '99.9%',
    });

    await stats.save();

    res.json({ message: 'Stats updated successfully', stats });
  } catch (error) {
    res.status(500).json({ message: 'Error updating stats', error });
  }
};
