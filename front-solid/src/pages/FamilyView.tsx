import { createEffect, createSignal } from 'solid-js'
import { useParams, useNavigate } from "@solidjs/router"
import { CircularProgress, Typography, Button, Stack } from '@suid/material'
import { Col, Grid } from '../components/ui/grid'
// import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
// import { Table, TableHeader, TableHead, TableCell, TableRow, TableBody } from '~/components/ui/table'
// import dayjs from 'dayjs'
import { FamilyData } from '../components/FamilyView/FamilyData'
import { OrdersSection } from '~/components/FamilyView/OrdersSection'
import { OpportunitiesSection } from '~/components/FamilyView/OpportuntiesSection'
import { ConversationSection } from '~/components/FamilyView/ConversationSection'
import { CalendarEventSection } from '~/components/FamilyView/CalendarEventSection'
import { TransactionSection } from '~/components/FamilyView/TransactionSection'

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

const FamilyView = () => {
    const [familyData, setFamilyData] = createSignal<{ _id: string, familyName: string, contacts: [contact], subscriptionStatus?: string }>()
    const params = useParams()

    const navigate = useNavigate()

    createEffect(async () => {
        if (params.id) {
            try {
                const response = await fetch(`/api/family/${params.id}`)
                const json = await response.json()
                setFamilyData(json.data)
            } catch (e) {
                console.error(e)
            }
        }
    })

    return (
        <>
            {!familyData() ? (<CircularProgress />) : (
                <Grid cols={12}>
                    <Col span={1}>
                        <Button variant='outlined' onClick={() => navigate(-1)}>Back</Button>
                    </Col>
                    {/* <Col span={7} /> */}
                    <Col span={11}>
                        <Stack spacing={3}>
                            <Typography variant='h6'>Family Data</Typography>
                            <FamilyData {...familyData()!} />
                            <Typography variant='h6'>Order History</Typography>
                            <OrdersSection {...familyData()!} />
                            <Typography variant='h6'>Transaction History</Typography>
                            <TransactionSection {...familyData()!} />
                            <Typography variant='h6'>Opportunities</Typography>
                            <OpportunitiesSection {...familyData()!} />
                            <Typography variant='h6'>Conversations</Typography>
                            <ConversationSection {...familyData()!} />
                            <Typography variant='h6'>Calendar Events</Typography>
                            <CalendarEventSection {...familyData()!} />
                        </Stack>
                    </Col>
                </Grid>
            )}
        </>
    )
}

export default FamilyView