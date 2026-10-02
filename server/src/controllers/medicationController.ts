import { type Request, type Response } from 'express';
import { Medication } from '../models/Medication.js';
import type {
  ErrorResponse,
  GetMedicationByIdResponse,
  GetMedicationsResponse,
  MedicationResponseDTO,
  MedicationsDTO,
} from '../types/medication.js';
import { buildFilters } from '../utils/buildFilters.js';

// Keep in sync with client/src/entities/medications/lib/constants.ts
const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 6;
const DEFAULT_PAGE = 1;

export const getMedications = async (
  req: Request<{}, {}, {}, MedicationsDTO>,
  res: Response<GetMedicationsResponse | ErrorResponse>,
) => {
  try {
    const { readyFilters, sortOptions } = buildFilters(req.query || {});

    const { page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE } = req.query;

    const pageNum = Math.max(1, Number(page) || DEFAULT_PAGE);
    const limitNum = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(pageSize) || DEFAULT_PAGE_SIZE));
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
  res: Response<GetMedicationByIdResponse | ErrorResponse>,
) => {
  try {
    if (!req.params.id) {
      res.status(404).json({ message: 'Medication not found' });
      return;
    }
    const medication = await Medication.findById<GetMedicationByIdResponse>(req.params.id);

    if (!medication) {
      res.status(404).json({ message: 'Medication not found' });
      return;
    }

    res.json(medication);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера при получении данных' });
  }
};
