import { model, Schema, Types } from 'mongoose';

export interface MessageItem {
  sender: Types.ObjectId;
  text: string;
  room: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<MessageItem>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    room: { type: String, required: true },
  },
  { timestamps: true },
);

MessageSchema.index({ room: 1, createdAt: -1 });

export const Message = model<MessageItem>('Message', MessageSchema);
