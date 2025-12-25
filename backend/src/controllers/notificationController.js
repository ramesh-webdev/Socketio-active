import { Notification } from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { limit = 50, skip = 0, read } = req.query;

    const query = { userId: req.user.id };
    if (read !== undefined) {
      query.read = read === 'true';
    }

    const notifications = await Notification.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      userId: req.user.id,
      read: false,
    });

    res.json({
      notifications,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
      },
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, actionUrl } = req.body;

    if (!userId || !title || !message) {
      return res
        .status(400)
        .json({ message: 'Missing required fields' });
    }

    const notification = new Notification({
      userId,
      title,
      message,
      type: type || 'info',
      actionUrl: actionUrl || null,
    });

    await notification.save();

    res.status(201).json({
      message: 'Notification created successfully',
      notification,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({
      message: 'Notification marked as read',
      notification,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as read', error });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    await Notification.updateMany(
      { userId: req.user.id, read: false },
      { read: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking notifications as read', error });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Notification.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error });
  }
};
