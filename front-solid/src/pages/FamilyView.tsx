import { For, createEffect, createSignal } from 'solid-js'
import { useParams, useNavigate } from "@solidjs/router"
import { RecordModel } from 'pocketbase'
import { CircularProgress, Typography, Button } from '@suid/material'
import { Col, Grid } from '../components/ui/grid'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const FamilyView = () => {
    const [familyData, setFamilyData] = createSignal<RecordModel | undefined>()
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
                        {(member) => (
                            <>
                                {member.contactType === 'Parent' && (
                                    <Col spanLg={1}>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>{`${member.firstName} ${member.lastName}`}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                {`Payment Provider: ${member.paymentProvider}`}
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
                        {(member) => (
                            <>
                                {member.contactType === 'Student' && (
                                    <Col spanLg={1}>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>{`${member.firstName} ${member.lastName}`}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                {`Program: ${member.program}`}
                                            </CardContent>
                                        </Card>
                                    </Col>
                                )}
                            </>
                        )}
                    </For>
                </Grid>
            )}
        </>
    )
}

export default FamilyView