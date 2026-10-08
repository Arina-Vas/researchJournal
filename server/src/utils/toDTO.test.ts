import { describe, expect, it } from 'vitest';
import { Types } from 'mongoose';
import { toDTO } from './toDTO.js';

describe('toDTO', () => {
  it('converts _id to a string and keeps the other fields', () => {
    const _id = new Types.ObjectId();

    expect(toDTO({ _id, name: 'Aspirin', tags: ['a'] })).toEqual({
      _id: _id.toString(),
      name: 'Aspirin',
      tags: ['a'],
    });
  });

  it('does not change the source document', () => {
    const doc = { _id: new Types.ObjectId(), name: 'Aspirin' };

    toDTO(doc);

    expect(doc._id).toBeInstanceOf(Types.ObjectId);
  });
});
