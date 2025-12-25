import express from 'express';
import {
  getStats,
  getSystemStatus,
  updateStats,
} from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', authenticate, getStats);
router.get('/system-status', authenticate, getSystemStatus);
router.post('/stats', authenticate, updateStats);

export default router;
