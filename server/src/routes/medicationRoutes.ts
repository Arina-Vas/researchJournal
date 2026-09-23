import { Router } from 'express';
import { getMedicationById, getMedications } from '../controllers/medicationController.js';

const router = Router();

router.get('/', getMedications);
router.get('/:id', getMedicationById);

export default router;
