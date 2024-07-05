import { For, createEffect, createSignal } from 'solid-js'
import { useParams, useNavigate } from "@solidjs/router"
import { CircularProgress, Typography, Button } from '@suid/material'
import { Col, Grid } from '../components/ui/grid'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Table, TableHeader, TableHead, TableCell, TableRow, TableBody } from '~/components/ui/table'
import dayjs from 'dayjs'

interface contact {
    _id: string,
    firstName: string,
    lastName: string,
    contactId: string,
    contactType: string,
    paymentProvider?: string,
    program?: string,
    orders?: [{
        orderId: string,
        product: string,
        date: string,
        subtotal: string,
        status: string,
        createdAt: string,
        updatedAt: string,
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
    }]
}

const FamilyView = () => {
    const [familyData, setFamilyData] = createSignal<{ _id: string, familyName: string, contacts: [contact] }>()
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

                <Grid cols={1} colsMd={2} colsLg={4} class='w-full gap-7'>

                    <Col span={1} spanLg={4} style={{ display: 'flex' }}>
                        <Button variant='outlined' size='small' onClick={() => navigate(-1)}>Back</Button>
                    </Col>
                    <Col span={1} spanLg={2}>
                        <Card>
                            <CardHeader>
                                <CardTitle>{familyData()?.familyName}</CardTitle>
                            </CardHeader>
                        </Card>
                    </Col>
                    <Col spanLg={2} />
                    <Col spanLg={4}>
                        <Typography variant='h6'>Parents</Typography>
                    </Col>
                    <For each={familyData()?.contacts}>
                        {(contact) => (
                            <>
                                {contact.contactType === 'Parent' && (
                                    <Col spanLg={1}>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>{`${contact.firstName} ${contact.lastName}`}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                {`Payment Provider: ${contact.paymentProvider}`}
                                            </CardContent>
                                        </Card>
                                    </Col>
                                )}
                            </>
                        )}
                    </For>

                    <Col spanLg={4}>
                        <Typography variant='h6'>Students</Typography>
                    </Col>
                    <For each={familyData()?.contacts}>
                        {(contact) => (
                            <>
                                {contact.contactType === 'Student' && (
                                    <Col spanLg={1}>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>{`${contact.firstName} ${contact.lastName}`}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                {`Program: ${contact.program}`}
                                            </CardContent>
                                        </Card>
                                    </Col>
                                )}
                            </>
                        )}
                    </For>
                    <Col spanLg={4}>
                    {/* <Separator /> */}
                        <Typography margin={2} variant='h6'>Order History</Typography>
                        <Col spanLg={1}>
                            <Card>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order ID</TableHead>
                                            <TableHead>Date Created</TableHead>
                                            <TableHead>Last Updated</TableHead>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Subtotal</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <For each={familyData()?.contacts}>
                                            {(member) => (
                                                <>
                                                {member.contactType === 'Parent' && member.transactions!.length > 0 && (
                                                        
                                                        <For each={member.transactions}>
                                                            {(order) => (
                                                                <TableRow>
                                                                    <TableCell class='text-left'>{order.transactionId}</TableCell>
                                                                    <TableCell class='text-left'>{dayjs(order.createdAt).format('DD/MMM/YYYY')}</TableCell>
                                                                    <TableCell class='text-left'>{dayjs(order.updatedAt).format('DD/MMM/YYYY')}</TableCell>
                                                                    <TableCell class='text-left'>{order.entitySourceName}</TableCell>
                                                                    <TableCell class='text-left'>{order.amount}</TableCell>
                                                                    <TableCell class='text-left'>{order.status}</TableCell>
                                                                </TableRow>
                                                            )}
                                                        </For>
                                                    )
                                                }
                                                </>
                                            )}
                                        </For>
                                    </TableBody>
                                </Table>
                            </Card>
                        </Col>
                    </Col>
                </Grid >
            )}
        </>
    )
}

export default FamilyView