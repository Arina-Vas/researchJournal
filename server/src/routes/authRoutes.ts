import { Router } from 'express';
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshToken,
  deleteUser,
  getMe,
} from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { message: 'Too many attempts, please try again later' },
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

const router = Router();

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshToken);
router.get('/me', authMiddleware, getMe);
router.delete('/delete', authMiddleware, deleteUser);

export default router;
