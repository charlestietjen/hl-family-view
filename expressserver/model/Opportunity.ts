import mongoose, { Schema, Document } from 'mongoose'

interface IOpportunity extends Document {
    opportunityId: string
    name: string
    monetaryValue: number
    pipelineId: string
    pipelineStageId: string
    pipelineStage: string
    assignedTo: string
    status: string
    source: string
    lastStatusChangeAt: Date
    lastStageChangeAt: Date
    lastActionDate: Date
    indexVersion: number
    createdAt: Date
    updatedAt: Date
    contactId: string
    locationId: string
    notes: string[]
    tasks: string[]
    calendarEvents: string[]
    customFields: {}
}

const opportunitySchema = new Schema({
    opportunityId: { type: String, required: true, unique: true, index: true },
    name: { type: String },
    monetaryValue: { type: Number },
    pipelineId: { type: String },
    pipelineStageId: { type: String },
    pipelineStage: { type: String },
    assignedTo: { type: String },
    status: { type: String },
    source: { type: String },
    lastStatusChangeAt: { type: Date },
    lastStageChangeAt: { type: Date },
    lastActionDate: { type: Date },
    indexVersion: { type: Number },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    contactId:  { type: String },
    locationId: { type: String },
    notes: { type: [String] },
    tasks: { type: [String] },
    calendarEvents: { type: [String] },
    customFields: { type: [{}] },
    followers: { type: [] },
})

export const Opportunity = mongoose.model<IOpportunity>('Opportunity', opportunitySchema)