import mongoose, { Schema } from 'mongoose'

const tokenSchema = new Schema({
    authCode: { type: String, required: true },
    tokenIssued: { type: Number, default: Date.now },
    access_token: { type: String, required: true },
    token_type: { type: String },
    expires_in: { type: Number },
    refresh_token: { type: String },
    scope: { type: String },
    userType: { type: String },
    locationId: { type: String, unique: true, required: true, index: true },
    companyId: { type: String },
    approvedLocations: { type: [String] },
    userId: { type: String },
    planId: { type: String },
})

export const Token = mongoose.model('Token', tokenSchema)