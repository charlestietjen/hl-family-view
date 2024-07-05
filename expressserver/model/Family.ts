import mongoose, { Schema, Document } from 'mongoose'
import { IContact } from './Contact'

interface IFamily extends Document {
    familyName: string
    contacts?: IContact[]
}

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

export const Family = mongoose.model<IFamily>('Family', familySchema)