import { type Request, type Response } from 'express';
import { Location } from '../models/Location.js';
import { Types } from 'mongoose';
import type { ErrorResponse, LocationDTO } from '@research/shared';
import { toDTO } from '../utils/toDTO.js';

export const getLocations = async (req: Request, res: Response<LocationDTO[] | ErrorResponse>) => {
  try {
    const locations = await Location.find().lean();

    res.json(locations.map(toDTO));
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching data' });
  }
};

export const getLocationById = async (
  req: Request<{ locationId: string }>,
  res: Response<LocationDTO | ErrorResponse>,
) => {
  try {
    const { locationId } = req.params;

    if (!Types.ObjectId.isValid(locationId)) {
      res.status(404).json({ message: 'Location not found' });
      return;
    }

    const location = await Location.findOne({ _id: new Types.ObjectId(locationId) }).lean();

    if (!location) {
      res.status(404).json({ message: 'Location not found' });
      return;
    }

    res.json(toDTO(location));
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching data' });
  }
};
