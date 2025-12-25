import express from 'express';
import {
  getActivities,
  getActivityById,
  createActivity,
  deleteActivity,
} from '../controllers/activityController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getActivities);
router.get('/:id', authenticate, getActivityById);
router.post('/', authenticate, createActivity);
router.delete('/:id', authenticate, deleteActivity);

export default router;
