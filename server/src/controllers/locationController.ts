import { type Request, type Response } from 'express';
import { Location } from '../models/Location.js';
import { Types } from 'mongoose';

export const getLocations = async (req: Request, res: Response) => {
  try {
    const locations = await Location.find();

    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching data' });
  }
};

export const getLocationById = async (req: Request<{ locationId: string }>, res: Response) => {
  try {
    const { locationId } = req.params;

    if (!Types.ObjectId.isValid(locationId)) {
      res.status(404).json({ message: 'Location not found' });
      return;
    }

    const location = await Location.findOne({ _id: new Types.ObjectId(locationId) });

    if (!location) {
      res.status(404).json({ message: 'Location not found' });
      return;
    }

    res.json(location);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching data' });
  }
};
