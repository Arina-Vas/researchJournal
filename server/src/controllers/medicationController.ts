import {Request, Response} from 'express';
import {Medication} from '../models/Medication';

export const getMedications = async (req: Request, res: Response) => {
    try {
        const medications = await Medication.find();

        res.json(medications);
    } catch (error) {
        res.status(500).json({message: 'Ошибка сервера при получении данных'});
    }
};

export const getMedicationById = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const medication = await Medication.findById(req.params.id);

        res.json(medication);
    } catch (error) {
        res.status(500).json({message: 'Ошибка сервера при получении данных'});
    }
};