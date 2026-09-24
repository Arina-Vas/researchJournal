import { Router } from 'express';
import { getLocationById, getLocations } from '../controllers/locationController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getLocations);
router.get('/:locationId', getLocationById);

export default router;
