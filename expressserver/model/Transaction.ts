import mongoose, { Schema } from 'mongoose'

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

export const Transaction = mongoose.model('Transaction', transactionSchema)