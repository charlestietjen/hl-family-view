import mongoose, { Schema } from 'mongoose'
import { Order } from './Order'

const contactSchema = new Schema({
    id: { type: String, required: true, unique: true },
    locationId: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    timezone: { type: String },
    country: { type: String },
    source: { type: String },
    dateAdded: { type: Date },
    customFields: { type: [String] },
    tags: { type: [String] },
    businessId: { type: String },
    contactType: { type: String },
    program: { type: String },
    orders: { type: [Order] },
})

export const Contact = mongoose.model('Contact', contactSchema)