import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema(
  {
    activeUsers: {
      type: Number,
      default: 0,
    },
    requestsPerMin: {
      type: Number,
      default: 0,
    },
    errorRate: {
      type: Number,
      default: 0,
    },
    uptime: {
      type: String,
      default: '99.9%',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    serverStatus: {
      apiServer: {
        type: String,
        enum: ['operational', 'degraded', 'offline'],
        default: 'operational',
      },
      database: {
        type: String,
        enum: ['operational', 'degraded', 'offline'],
        default: 'operational',
      },
      cacheLayer: {
        type: String,
        enum: ['operational', 'degraded', 'offline'],
        default: 'operational',
      },
      cdn: {
        type: String,
        enum: ['operational', 'degraded', 'offline'],
        default: 'operational',
      },
    },
  },
  {
    timestamps: true,
  }
);

// TTL index - auto-delete documents after 30 days
statsSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

export const Stats = mongoose.model('Stats', statsSchema);
