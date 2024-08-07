import mongoose, { Schema, Document } from 'mongoose';

interface IUCToken extends Document {
    createdAt?: Date;
    email: string;
    firstName?: string;
    id?: number;
    lastName?: string;
    role?: string;
    status?: string;
    token?: string;
    updatedAt?: Date;
    username?: string;
}

const UCTokenSchema = new Schema<IUCToken>({
    createdAt: { type: Date },
    email: { type: String, required: true },
    firstName: { type: String },
    id: { type: Number },
    lastName: { type: String },
    role: { type: String },
    status: { type: String },
    token: { type: String },
    updatedAt: { type: Date },
    username: { type: String },
});

export const UCToken = mongoose.model<IUCToken>('UCToken', UCTokenSchema);