import { Router } from 'express';
import { getLocationById, getLocations } from '../controllers/locationController.js';

const router = Router();

router.get('/', getLocations);
router.get('/:locationId', getLocationById);

export default router;
