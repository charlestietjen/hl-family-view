import mongoose, { Schema, Document } from 'mongoose'

interface ICampaign extends Document {
    campaignId: string
    name: string
    status: string
    locationId: string
}

const campaignSchema = new Schema<ICampaign>({
    campaignId: { type: String, required: true, unique: true },
    name: { type: String },
    status: { type: String },
    locationId: { type: String }
})

export const Campaign = mongoose.model<ICampaign>('Campaign', campaignSchema)