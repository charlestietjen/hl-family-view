import { createEffect, createSignal } from 'solid-js'
import { useParams, useNavigate } from "@solidjs/router"
import { CircularProgress, Typography, Button, Stack } from '@suid/material'
import { Col, Grid } from '../components/ui/grid'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
// import { Table, TableHeader, TableHead, TableCell, TableRow, TableBody } from '~/components/ui/table'
// import dayjs from 'dayjs'
import { FamilyData } from '../components/FamilyView/FamilyData'
import { OrdersSection } from '~/components/FamilyView/OrdersSection'
import { OpportunitiesSection } from '~/components/FamilyView/OpportunitiesSection'
import { ConversationSection } from '~/components/FamilyView/ConversationSection'
import { CalendarEventSection } from '~/components/FamilyView/CalendarEventSection'
import { TransactionSection } from '~/components/FamilyView/TransactionSection'
import { SubscriptionsSection } from '~/components/FamilyView/SubscriptionsSection'
import { contact } from '~/contact'

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
                            <Card>
                                <CardHeader>
                                    <Typography variant='h6'>Account Data</Typography>
                                </CardHeader>
                                <CardContent>
                                    <FamilyData {...familyData()!} />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Typography variant='h6'>Conversations</Typography>
                                </CardHeader>
                                <CardContent>
                                    <ConversationSection {...familyData()!} />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <OpportunitiesSection {...familyData()!} />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Typography variant='h6'>Calendar Events</Typography>
                                </CardHeader>
                                <CardContent>
                                    <CalendarEventSection {...familyData()!} />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <OrdersSection {...familyData()!} />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <SubscriptionsSection {...familyData()!} />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <TransactionSection {...familyData()!} />
                                </CardContent>
                            </Card>
                        </Stack>
                    </Col>
                </Grid>
            )}
        </>
    )
}

export default FamilyView