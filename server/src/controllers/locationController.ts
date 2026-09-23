import {Request, Response} from 'express';
import {Location} from '../models/Location';

export const getLocations = async (req: Request, res: Response) => {
    try {
        const locations = await Location.find();

        res.json(locations);
    } catch (error) {
        res.status(500).json({message: 'Ошибка сервера при получении данных'});
    }
};

export const getLocationById = async (req: Request<{ locationId: string }>, res: Response) => {
    try {
        const {locationId} = req.params;
        const location = await Location.findOne({ id: locationId });

        res.json(location);
    } catch (error) {
        res.status(500).json({message: 'Ошибка сервера при получении данных'});
    }
};
