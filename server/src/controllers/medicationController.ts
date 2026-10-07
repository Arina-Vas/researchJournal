import { type Request, type Response } from 'express';
import { Medication, type MedicationDoc } from '../models/Medication.js';
import { buildFilters } from '../utils/buildFilters.js';
import { toDTO } from '../utils/toDTO.js';
import { type PipelineStage, Types } from 'mongoose';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  type MessageResponse,
  getIssueMessage,
  type GetMedicationsResponse,
  MAX_PAGE_SIZE,
  type MedicationDTO,
  MedicationsQuerySchema,
  ObjectIdSchema,
} from '@research/shared';
import type { LocationDoc } from '../models/Location.js';

type MedicationWithLocationDoc = Omit<MedicationDoc, 'location'> & {
  _id: Types.ObjectId;
  location: LocationDoc & { _id: Types.ObjectId };
};

export const getMedications = async (
  req: Request,
  res: Response<GetMedicationsResponse | MessageResponse>,
) => {
  try {
    const parsedQuery = MedicationsQuerySchema.safeParse(req.query);
    if (!parsedQuery.success) {
      res.status(400).json({ message: getIssueMessage(parsedQuery.error) });
      return;
    }

    const { readyFilters, sortOptions, isSortByLocation } = buildFilters(parsedQuery.data);

    const { page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE } = parsedQuery.data;

    const pageNum = Math.max(1, Number(page) || DEFAULT_PAGE);
    const limitNum = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(pageSize) || DEFAULT_PAGE_SIZE));
    const skip = (pageNum - 1) * limitNum;

    const lookupLocations: PipelineStage[] = [
      // location is stored as a string, locations._id is an ObjectId
      { $addFields: { locationObjectId: { $toObjectId: '$location' } } },
      {
        $lookup: {
          from: 'locations',
          localField: 'locationObjectId',
          foreignField: '_id',
          as: 'location',
        },
      },
      {
        $unwind: '$location',
      },
      { $unset: 'locationObjectId' },
    ];

    const sort: PipelineStage[] = [{ $sort: sortOptions }, { $skip: skip }, { $limit: limitNum }];

    const params: PipelineStage[] = isSortByLocation
      ? [{ $match: readyFilters }, ...lookupLocations, ...sort]
      : [{ $match: readyFilters }, ...sort, ...lookupLocations];

    const [documents, totalFilteredItems, totalItems] = await Promise.all([
      Medication.aggregate<MedicationWithLocationDoc>(params),
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
    res.status(500).json({ message: 'Server error while fetching data' });
  }
};

export const getMedicationById = async (
  req: Request<{ id: string }>,
  res: Response<MedicationDTO | MessageResponse>,
) => {
  try {
    const { id } = req.params;

    if (!ObjectIdSchema.safeParse(id).success) {
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
    res.status(500).json({ message: 'Server error while fetching data' });
  }
};
