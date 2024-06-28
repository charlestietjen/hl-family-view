import mongoose, { Schema } from 'mongoose'
import { Contact } from './Contact'

const familySchema = new Schema({
    familyName: { type: String, required: true, unique: true },
},
    {
        virtuals: {
            contacts: {
                options: {
                    ref: 'Contact',
                    localField: 'familyName',
                    foreignField: 'companyName',
                    justOne: false
                }
            }
        },
        toJSON: {
            virtuals: true
        }
    })

export const Family = mongoose.model('Family', familySchema)