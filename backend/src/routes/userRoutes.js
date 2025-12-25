import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getAllUsers);
router.get('/:id', authenticate, getUserById);
router.patch('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, deleteUser);

export default router;
