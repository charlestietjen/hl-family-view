import mongoose, { Schema, Document } from 'mongoose'

interface ITransaction extends Document {
    transactionId: string
    contactId: string
    contactName: string
    contactEmail: string
    currency: string
    amount: string
    status: string
    liveMode: string
    entityType: string
    entityId: string
    entitySourceType: string
    entitySourceSubType: string
    entitySourceName: string
    entitySourceId: string
    paymentProviderType: string
    createdAt: string
    updatedAt: string
}

const transactionSchema = new Schema({
    transactionId: { type: String, required: true, unique: true, index: true },
    contactId: { type: String, required: true },
    contactName: { type: String },
    contactEmail: { type: String },
    currency: { type: String },
    amount: { type: String },
    status: { type: String },
    liveMode: { type: String },
    entityType: { type: String },
    entityId: { type: String },
    entitySourceType: { type: String },
    entitySourceSubType: { type: String },
    entitySourceName: { type: String },
    entitySourceId: { type: String },
    paymentProviderType: { type: String },
    createdAt: { type: String },
    updatedAt: { type: String },
})

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema)