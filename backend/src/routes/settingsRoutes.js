import express from 'express';
import {
  getSettings,
  updateSettings,
  resetSettings,
} from '../controllers/settingsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getSettings);
router.patch('/', authenticate, updateSettings);
router.post('/reset', authenticate, resetSettings);

export default router;
