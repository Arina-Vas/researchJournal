import { Router } from 'express';
import {getLocationById, getLocations} from "../controllers/locationController";


const router = Router();

router.get('/', getLocations);
router.get('/:locationId', getLocationById);

export default router;