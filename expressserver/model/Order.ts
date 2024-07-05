import mongoose, { Schema, Document } from 'mongoose'

interface IOrder extends Document {
    altId: string
    altType: string
    contactId: string
    contactName: string
    contactEmail: string
    currency: string
    amount: string
    subtotal: string
    discount: string
    status: string
    liveMode: string
    totalProducts: string
    sourceType: string
    sourceName: string
    sourceId: string
    sourceUrl: string
    sourceReferrer: string
    sourceMedium: string
    sourceCampaign: string
    dateAdded: Date
    dateUpdated: Date
    orderId: string
    product: string
    productId: string
    createdAt: string
    updatedAt: string
}

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
    orderId: { type: String, unique: true, required: true, index: true },
    product: { type: String },
    productId: { type: String },
    createdAt: { type: String },
    updatedAt: { type: String },
},
    {
        virtuals: {
            transactions: {
                options: {
                    ref: 'Transaction',
                    localField: 'orderId',
                    foreignField: 'entityId',
                    justOne: false
                }
            }
        },
        toJSON: {
            virtuals: true
        }
    })

export const Order = mongoose.model<IOrder>('Order', orderSchema)