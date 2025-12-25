import { Settings } from '../models/Settings.js';

export const getSettings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    let settings = await Settings.findOne({ userId: req.user.id });

    if (!settings) {
      // Create default settings for new user
      settings = new Settings({ userId: req.user.id });
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error });
  }
};

export const updateSettings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const {
      theme,
      emailNotifications,
      pushNotifications,
      activityLog,
      twoFactorEnabled,
      language,
      timezone,
      preferences,
    } = req.body;

    let settings = await Settings.findOne({ userId: req.user.id });

    if (!settings) {
      settings = new Settings({ userId: req.user.id });
    }

    // Update fields
    if (theme) settings.theme = theme;
    if (emailNotifications !== undefined)
      settings.emailNotifications = emailNotifications;
    if (pushNotifications !== undefined)
      settings.pushNotifications = pushNotifications;
    if (activityLog !== undefined) settings.activityLog = activityLog;
    if (twoFactorEnabled !== undefined)
      settings.twoFactorEnabled = twoFactorEnabled;
    if (language) settings.language = language;
    if (timezone) settings.timezone = timezone;
    if (preferences) settings.preferences = preferences;

    await settings.save();

    res.json({
      message: 'Settings updated successfully',
      settings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings', error });
  }
};

export const resetSettings = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    await Settings.deleteOne({ userId: req.user.id });

    const defaultSettings = new Settings({ userId: req.user.id });
    await defaultSettings.save();

    res.json({
      message: 'Settings reset to defaults',
      settings: defaultSettings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting settings', error });
  }
};
