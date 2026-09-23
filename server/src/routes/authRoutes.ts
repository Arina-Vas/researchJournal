import { Router } from 'express';
import { getLocationById, getLocations } from '../controllers/locationController.js';
import { loginUser, logoutUser, registerUser, refreshToken, deleteUser } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshToken);
router.delete('/delete', authMiddleware, deleteUser);

export default router;
