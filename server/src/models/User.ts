import {Schema, model, Document} from 'mongoose';

export interface User extends Document {
    email: string;
    passwordHash: string;
}

const UserSchema = new Schema<User>({
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'], unique: true
    },
    passwordHash: {
        type: String, required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false,
    },
}, {timestamps: true});

export const User = model<User>('User', UserSchema);