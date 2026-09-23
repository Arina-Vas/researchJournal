import { Router } from 'express';
import {getLocationById, getLocations} from "../controllers/locationController";


const router = Router();

router.post('/auth/register', getLocations);
router.post('/auth/login', getLocations);
router.post('/auth/logout', getLocations);
router.delete('/auth/:id', getLocationById);

export default router;