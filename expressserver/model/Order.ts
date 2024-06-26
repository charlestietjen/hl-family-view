import mongoose, { Schema } from 'mongoose'

const orderSchema = new Schema({
    altId: { type: String, required: true },
    altType: { type: String, required: true },
    contactId: { type: String, required: true },
    contactName: { type: String },
    contactEmail: { type: String },
    currency: { type: String },
    amount: { type: String },
    subtotal: { type: String },
    discount: { type: String },
    status: { type: String },
    liveMode: { type: String },
    totalProducts: { type: String },
    sourceType: { type: String },
    sourceName: { type: String },
    sourceId: { type: String },
    sourceUrl: { type: String },
    sourceReferrer: { type: String },
    sourceMedium: { type: String },
    sourceCampaign: { type: String },
    dateAdded: { type: Date },
    dateUpdated: { type: Date },
})

export const Order = mongoose.model('Order', orderSchema)