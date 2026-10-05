import type { Types } from 'mongoose';

export const toDTO = <T extends { _id: Types.ObjectId }>(doc: T): Omit<T, '_id'> & { _id: string } => ({
  ...doc,
  _id: doc._id.toString(),
});
