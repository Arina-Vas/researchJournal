import { type Request, type Response } from 'express';
import { Medication } from '../models/Medication.js';
import type {
  ErrorResponse,
  GetMedicationsResponse,
  MedicationResponseDTO,
  MedicationsDTO,
} from '../types/medication.js';
import { buildFilters } from '../utils/buildFilters.js';
import { Location } from '../models/Location.js';

export const getMedications = async (
  req: Request<{}, {}, {}, MedicationsDTO>,
  res: Response<GetMedicationsResponse | ErrorResponse>,
) => {
  try {
    const { readyFilters, sortOptions } = buildFilters(req.query || {});

    const { page = 1, pageSize = 6 } = req.query;

    const pageNum = Math.max(1, page || 1);
    const limitNum = Math.max(1, pageSize || 10);
    const skip = (pageNum - 1) * limitNum;

    const [[documents, totalFilteredItems], totalItems] = await Promise.all([
      Medication.findAndCount(readyFilters, null, {
        sort: sortOptions,
        populate: { path: 'location' },
        skip,
        limit: limitNum,
        lean: true,
      }),
      Medication.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalFilteredItems / limitNum);

    if (!documents) {
      return res.status(404).json({ message: 'Medications not found' });
    }

    res.status(200).json({
      data: documents as unknown as MedicationResponseDTO[],
      pagination: {
        page: pageNum,
        pageSize: limitNum,
        totalItems,
        totalPages,
        totalFilteredItems,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Ошибка сервера при получении данных' });
  }
};

export const getMedicationById = async (
  req: Request<{ id: string }>,
  res: Response<MedicationResponseDTO | ErrorResponse>,
) => {
  try {
    const medication = await Medication.findById<MedicationResponseDTO>(req.params.id);

    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    res.json(medication);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера при получении данных' });
  }
};
