import { type Request, type Response } from 'express';
import { Medication } from '../models/Medication.js';
import { buildFilters } from '../utils/buildFilters.js';
import { toDTO } from '../utils/toDTO.js';
import { Types } from 'mongoose';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  type ErrorResponse,
  getIssueMessage,
  type GetMedicationsResponse,
  MAX_PAGE_SIZE,
  type MedicationResponse,
  MedicationsQuerySchema,
} from '@research/shared';
import { type LocationDoc } from '../models/Location.js';

export const getMedications = async (req: Request, res: Response<GetMedicationsResponse | ErrorResponse>) => {
  try {
    const parsedQuery = MedicationsQuerySchema.safeParse(req.query);
    if (!parsedQuery.success) {
      res.status(400).json({ message: getIssueMessage(parsedQuery.error) });
      return;
    }

    const { readyFilters, sortOptions } = buildFilters(parsedQuery.data);

    const { page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE } = parsedQuery.data;

    const pageNum = Math.max(1, Number(page) || DEFAULT_PAGE);
    const limitNum = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(pageSize) || DEFAULT_PAGE_SIZE));
    const skip = (pageNum - 1) * limitNum;

    const [documents, totalFilteredItems, totalItems] = await Promise.all([
      Medication.find(readyFilters)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .populate<{ location: LocationDoc & { _id: Types.ObjectId } }>('location')
        .lean(),
      Medication.countDocuments(readyFilters),
      Medication.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalFilteredItems / limitNum);

    res.status(200).json({
      data: documents.map(doc => toDTO({ ...doc, location: toDTO(doc.location) })),
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
  res: Response<MedicationResponse | ErrorResponse>,
) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(404).json({ message: 'Medication not found' });
      return;
    }

    const medication = await Medication.findById(id).lean();

    if (!medication) {
      res.status(404).json({ message: 'Medication not found' });
      return;
    }

    res.json(toDTO(medication));
  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера при получении данных' });
  }
};
