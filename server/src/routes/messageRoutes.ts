import { Router } from 'express';
import { getMessagesHistory } from '../controllers/messageController.js';

const router = Router();

// router.use(authMiddleware);

router.get('/:room', getMessagesHistory);

export default router;
