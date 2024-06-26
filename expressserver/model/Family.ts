import mongoose, { Schema } from 'mongoose'
import { Contact } from './Contact'

const familySchema = new Schema({
    familyName: { type: String, required: true },
    members: { type: [Contact], required: true },
})

export const Family = mongoose.model('Family', familySchema)