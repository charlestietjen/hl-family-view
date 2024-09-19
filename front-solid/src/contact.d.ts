export interface contact {
    _id: string,
    firstName: string,
    lastName: string,
    contactId: string,
    contactType: string,
    paymentProvider?: string,
    program?: string,
    createdAt: string,
    updatedAt: string,
    orders?: [{
        orderId: string,
        product: string,
        date: string,
        subtotal: string,
        amount: string,
        status: string,
        createdAt: string,
        updatedAt: string,
        items: [{
            _id: string
            authorizeAmount: number,
            locationId: string
            name: string
            price: {}
            product: {
                name: string
                productType: string
                _id: string
            }
        }]
    }],
    transactions?: [{
        transactionId: string,
        contactId: string,
        contactName: string,
        contactEmail: string,
        currency: string,
        amount: string,
        status: string,
        liveMode: string,
        entityType: string,
        entityId: string,
        entitySourceType: string,
        entitySourceSubType: string,
        entitySourceName: string,
        entitySourceId: string,
        paymentProviderType: string,
        createdAt: string,
        updatedAt: string,
    },],
    subscriptions: [{
        subscriptionId: string,
        contactId: string,
        contactName: string,
        contactEmail: string,
        currency: string,
        amount: string,
        status: string,
        liveMode: string,
        entityType: string,
        entityId: string,
        entitySourceType: string,
        entitySourceSubType: string,
        entitySourceName: string,
        entitySourceId: string,
        paymentProviderType: string,
        createdAt: string,
        updatedAt: string,
    }],
    opportunities: [
        {
            opportunityId: string
            name: string
            monetaryValue: number
            pipelineId: string
            pipelineStageId: string
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
    ],
    conversations: [
        {
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
            messages: [{
                id: string
                body: string
                dateAdded: string
            }]
        }
    ],
    calendarEvents: [
        {
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
    ]
}