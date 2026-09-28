import { Router } from 'express';
import { loginUser, logoutUser, registerUser, refreshToken, deleteUser, getMe } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshToken);
router.get('/me', authMiddleware, getMe);
router.delete('/delete', authMiddleware, deleteUser);

export default router;
