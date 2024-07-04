import { Box, CardContent, List, ListItem, Typography } from "@suid/material"
import { createSignal, createEffect, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import {
    Card,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"
import { Grid } from "./ui/grid";

const FamilyList = () => {
    const [families, setFamilies] = createSignal<Array<{_id: string, familyName: string, contacts: [{firstName: string, contactType: string}]}>>()
    const navigate = useNavigate()

    createEffect(async () => {
        const _families = await fetch("/api/families")
        const familyData = await _families.json()
        setFamilies(familyData.data)
    })

    return (
        <Box>
            {/* <Stack spacing={3}> */}
            <Grid cols={3}>
                <For each={families()}>
                    {(row) => (
                        <Card onClick={() => navigate(`/family/${row._id}`)} style={{ cursor: 'pointer', width: '90%' }}>
                            <CardHeader>
                                <CardTitle>{row.familyName}</CardTitle>
                                <CardContent>
                                    <Typography variant='subtitle2'>Parents</Typography>
                                    <List>
                                    <For each={row.contacts}>
                                        {(member) => {
                                            if (member.contactType === 'Parent') 
                                            return <ListItem><Typography variant='body2'>{member.firstName}</Typography></ListItem>}}
                                    </For>
                                    </List>
                                    <Typography variant='subtitle2'>Students</Typography>
                                    <List>
                                        <For each={row.contacts}>
                                            {(member) => {
                                                if (member.contactType === 'Student')
                                                return <ListItem><Typography variant='body2'>{member.firstName}</Typography></ListItem>}}
                                        </For>
                                    </List>
                                </CardContent>
                            </CardHeader>
                        </Card>
                    )}
                </For>
            </Grid>
            {/* </Stack> */}
        </Box>
    )
}

export default FamilyList