import mongoose, { Schema, Document } from "mongoose";

interface ICalendar extends Document {
  isActive: boolean;
  notifications: Notification[];
  locationId: string;
  groupId: string;
  teamMembers: TeamMember[];
  eventType: string;
  name: string;
  description: string;
  slug: string;
  widgetSlug: string;
  calendarType: string;
  widgetType: string;
  eventTitle: string;
  eventColor: string;
  meetingLocation: string;
  slotDuration: number;
  slotDurationUnit: string;
  slotInterval: number;
  slotIntervalUnit: string;
  slotBuffer: number;
  slotBufferUnit: string;
  preBuffer: number;
  preBufferUnit: string;
  appoinmentPerSlot: number;
  appoinmentPerDay: number;
  allowBookingAfter: number;
  allowBookingAfterUnit: string;
  availabilities: Availability[];
  guestType: string;
  consentLabel: string;
  calendarCoverImage: string;
  calendarId: string;
}

interface Notification {
  type: string;
  trigger: string;
  messageTemplate: string;
}

interface TeamMember {
  memberId: string;
  memberRole: string;
  memberStatus: string;
}

interface Availability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

const notificationSchema = new Schema({
  type: String,
  shouldSendToContact: Boolean,
  shouldSendToGuest: Boolean,
  shouldSendToUser: Boolean,
  shouldSendToSelectedUsers: Boolean,
  selectedUsers: [String],
}, { _id: false });

const teamMemberSchema = new Schema({
  userId: String,
  priority: Number,
  meetingLocationType: String,
  meetingLocation: String,
  isPrimary: Boolean,
}, { _id: false });

const availabilitySchema = new Schema({
  id: String,
  date: Date,
  hours: [{
    openHour: Number,
    openMinute: Number,
    closeHour: Number,
    closeMinute: Number,
  }],
  deleted: Boolean,
}, { _id: false });

const calendarSchema = new Schema({
  isActive: Boolean,
  notifications: [notificationSchema],
  locationId: String,
  groupId: String,
  teamMembers: [teamMemberSchema],
  eventType: String,
  name: String,
  description: String,
  slug: String,
  widgetSlug: String,
  calendarType: String,
  widgetType: String,
  eventTitle: String,
  eventColor: String,
  meetingLocation: String,
  slotDuration: Number,
  slotDurationUnit: String,
  slotInterval: Number,
  slotIntervalUnit: String,
  slotBuffer: Number,
  slotBufferUnit: String,
  preBuffer: Number,
  preBufferUnit: String,
  appoinmentPerSlot: Number,
  appoinmentPerDay: Number,
  allowBookingAfter: Number,
  allowBookingAfterUnit: String,
  availabilities: [availabilitySchema],
  guestType: String,
  consentLabel: String,
  calendarCoverImage: String,
  calendarId: String,
});

export const Calendar = mongoose.model<ICalendar>('Calendar', calendarSchema);