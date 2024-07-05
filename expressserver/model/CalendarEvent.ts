import mongoose, { Schema, Document } from 'mongoose';

interface ICalendarEvent extends Document {
    calendarEventId: string;
    address: string;
    title: string;
    calendarId: string;
    locationId: string;
    contactId: string;
    groupId: string;
    appointmentStatus: string;
    assignedUserId: string;
    users: string[];
    notes: string;
    startTime: string;
    endTime: string;
    dateAdded: string;
    dateUpdated: string;
    assignedResources: string[];
}

const calendarEventSchema = new Schema({
    calendarEventId: { type: String, required: true },
    address: { type: String },
    title: { type: String, required: true },
    calendarId: { type: String, required: true },
    locationId: { type: String },
    contactId: { type: String, required: true },
    groupId: { type: String },
    appointmentStatus: { type: String, required: true },
    assignedUserId: { type: String },
    users: [{ type: String }],
    notes: { type: String },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    dateAdded: { type: String },
    dateUpdated: { type: String },
    assignedResources: [{ type: String }]
});

export const CalendarEvent = mongoose.model<ICalendarEvent>('CalendarEvent', calendarEventSchema);