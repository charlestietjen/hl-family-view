import mongoose, { Schema, Document } from 'mongoose'

export interface IContact extends Document {
    contactId: string
    locationId: string
    email: string
    firstName: string
    lastName: string
    source: string
    dateAdded: Date
    customFields: {}
    tags: string[]
    businessId: string
    contactType: string
    program: string
    companyName: string
    paymentProvider: string
    campDates: Date[]
}

const contactSchema = new Schema({
    contactId: { type: String, required: true, unique: true },
    locationId: { type: String, required: true },
    email: { type: String },
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
    campDates: { type: [Date] },
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
            },
            transactions: {
                options: {
                    ref: 'Transaction',
                    localField: 'contactId',
                    foreignField: 'contactId',
                    justOne: false
                }
            },
            conversations: {
                options: {
                    ref: 'Conversation',
                    localField: 'contactId',
                    foreignField: 'contactId',
                    justOne: false
                }
            },
            opportunities: {
                options: {
                    ref: 'Opportunity',
                    localField: 'contactId',
                    foreignField: 'contactId',
                    justOne: false
                }
            },
            calendarEvents: {
                options: {
                    ref: 'CalendarEvent',
                    localField: 'contactId',
                    foreignField: 'contactId',
                    justOne: false
                }
            },
            subscriptions: {
                options: {
                    ref: 'Subscription',
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

export const Contact = mongoose.model<IContact>('Contact', contactSchema)