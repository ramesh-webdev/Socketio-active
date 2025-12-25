import { Activity } from '../models/Activity.js';

export const getActivities = async (req, res) => {
  try {
    const { limit = 50, skip = 0, type } = req.query;

    const query = type ? { type } : {};
    const activities = await Activity.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Activity.countDocuments(query);

    res.json({
      activities,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities', error });
  }
};

export const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity', error });
  }
};

export const createActivity = async (req, res) => {
  try {
    const { userId, userName, action, description, type, metadata } = req.body;

    if (!userId || !userName || !action || !description) {
      return res
        .status(400)
        .json({ message: 'Missing required fields' });
    }

    const activity = new Activity({
      userId,
      userName,
      action,
      description,
      type: type || 'other',
      metadata: metadata || {},
    });

    await activity.save();

    res.status(201).json({
      message: 'Activity created successfully',
      activity,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating activity', error });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Activity.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting activity', error });
  }
};
