import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['login', 'logout', 'create', 'update', 'delete', 'view', 'other'],
      default: 'other',
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: false,
  }
);

// TTL index - auto-delete documents after 90 days
activitySchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

export const Activity = mongoose.model('Activity', activitySchema);
