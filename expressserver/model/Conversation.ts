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
    messages: IMessage[]
}


interface IMessage extends Document {
    id: string;
    type: number;
    locationId: string;
    contactId: string;
    conversationId: string;
    dateAdded: Date;
    body: string;
    direction: string;
    status: string;
    contentType: string;
    attachments: string[];
    meta: {
      email: {
        messageIds: string[];
      };
    };
    source: string;
  }
  
  const messageSchema = new Schema<IMessage>({
    id: { type: String, required: true },
    type: { type: Number },
    locationId: { type: String },
    contactId: { type: String, required: true },
    conversationId: { type: String, required: true },
    dateAdded: { type: Date },
    body: { type: String },
    direction: { type: String },
    status: { type: String },
    contentType: { type: String },
    attachments: [{ type: String }],
    meta: {
      email: {
        messageIds: [{ type: String }],
      },
    },
    source: { type: String },
  }, { _id: false });


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
    messages: [messageSchema],
})

export const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema)