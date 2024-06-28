import mongoose, { Schema } from 'mongoose'

const contactSchema = new Schema({
    contactId: { type: String, required: true, unique: true },
    locationId: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    source: { type: String },
    dateAdded: { type: Date },
    customFields: { type: [{}] },
    tags: { type: [String] },
    businessId: { type: String },
    contactType: { type: String },
    program: { type: String },
    companyName: { type: String },
    paymentProvider: { type: String },
},
    {
        virtuals: {
            orders: {
                options: {
                    ref: 'Order',
                    localField: 'contactId',
                    foreignField: 'contactId',
                    justOne: false
                }
            }
        },
        toJSON: {
            virtuals: true
        }
    })

export const Contact = mongoose.model('Contact', contactSchema)