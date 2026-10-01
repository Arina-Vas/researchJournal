import { Router } from 'express';
import { getUserById, getUsers } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getUsers);
router.get('/:userId', getUserById);

export default router;
