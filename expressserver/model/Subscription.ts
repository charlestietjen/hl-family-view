import mongoose, { Schema, Document } from 'mongoose'

interface ISubscription extends Document {
    altId: string
    altType: string
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
    entitySourceName: string
    entitySourceId: string
    entitySourceMeta: string
    subscriptionId: string
    subscriptionSnapshot: string
    paymentProviderType: string
    paymentProviderConnectedAccount: string
    createdAt: string
    updatedAt: string
}

interface entitySourceMetaSchema {
    domain: string,
    pageId: string,
    pageUrl: string,
    stepId: string,
}

interface subscriptionsSnapshot {
    status: string,
    status_update_time: string,
    id: string,
    plan_id: string,
    start_time: string,
    quantity: number,
}

const entitySourceMetaSchema = new Schema({
    domain: { type: String },
    pageId: { type: String },
    pageUrl: { type: String },
    stepId: { type: String },
})

const subscriptionsSnapshotSchema = new Schema({
    status: { type: String },
    status_update_time: { type: String },
    id: { type: String },
    plan_id: { type: String },
    start_time: { type: String },
    quantity: { type: Number },
})

const subscriptionSchema = new Schema({
    altId: { type: String, required: true },
    altType: { type: String },
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
    entitySourceName: { type: String },
    entitySourceId: { type: String },
    entitySourceMeta: entitySourceMetaSchema,
    subscriptionId: { type: String },
    subscriptionSnapshot: subscriptionsSnapshotSchema,
    paymentProviderType: { type: String },
    paymentProviderConnectedAccount: { type: String },
    createdAt: { type: String },
    updatedAt: { type: String },
})

export const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema)