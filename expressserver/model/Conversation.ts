import mongoose, { Schema, Document } from 'mongoose'

interface IConversation extends Document {
    conversationId: string
    contactId: string
    locationId: string
    lastMessageBody: string
    lastMessageType: string
    type: string
    unreadCount: number
    fullName: string
    contactName: string
    email: string
    phone: string
}

const conversationSchema = new Schema({
    conversationId: { type: String, required: true, unique: true, index: true },
    contactId: { type: String, required: true },
    locationId: { type: String, required: true },
    lastMessageBody: { type: String },
    lastMessageType: { type: String },
    type: { type: String },
    unreadCount: { type: Number },
    fullName: { type: String },
    contactName: { type: String },
    email: { type: String },
    phone: { type: String },
})

export const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema)