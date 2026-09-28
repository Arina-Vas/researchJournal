import { Router } from 'express';
import { getMedicationById, getMedications } from '../controllers/medicationController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getMedications);
router.get('/:id', getMedicationById);

export default router;
