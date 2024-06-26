import { For, createSignal } from 'solid-js'
import { useParams, useNavigate } from "@solidjs/router"
import { getFamily } from "../utils/Pocketbase"
import { RecordModel } from 'pocketbase'
import { CircularProgress, Typography, Button } from '@suid/material'
import { Col, Grid } from '../components/ui/grid'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const FamilyView = () => {
    const [familyData, setFamilyData] = createSignal<RecordModel | undefined>()
    const params = useParams()
    getFamily(params.id).then(family => setFamilyData(family))
    const navigate = useNavigate()

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
                    <For each={familyData()?.expand?.members}>
                        {(member) => (
                            <>
                                {member.customFields?.find((c: { id: string }) => c.id === 'rIIeQaw4ZZCod1yS255v')?.value === 'Parent' && (
                                    <Col spanLg={1}>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>{`${member.firstNameRaw} ${member.lastNameRaw}`}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                {`Payment Provider: ${member.customFields?.find((c: { id: string }) => c.id === 'uJVJnjgqvd8uqk7FezmK')?.value}`}
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
                    <For each={familyData()?.expand?.members}>
                        {(member) => (
                            <>
                                {member.customFields?.find((c: { id: string }) => c.id === 'rIIeQaw4ZZCod1yS255v')?.value === 'Student' && (
                                    <Col spanLg={1}>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>{`${member.firstNameRaw} ${member.lastNameRaw}`}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                {`Program: ${member.customFields?.find((c: { id: string }) => c.id === 'jBtLbGspnLx9TqayycX4')?.value}`}
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