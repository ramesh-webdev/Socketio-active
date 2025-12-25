import express from 'express';
import {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getNotifications);
router.post('/', authenticate, createNotification);
router.patch('/:id/read', authenticate, markAsRead);
router.patch('/mark-all-read', authenticate, markAllAsRead);
router.delete('/:id', authenticate, deleteNotification);

export default router;
