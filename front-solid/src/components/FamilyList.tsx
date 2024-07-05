import { Box } from "@suid/material"
import { createSignal, createEffect, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
// import {
//     Card,
//     CardHeader,
//     CardTitle,
// } from "~/components/ui/card"
// import { Grid } from "./ui/grid";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

const FamilyList = () => {
    const [families, setFamilies] = createSignal<Array<{ _id: string, familyName: string, contacts: [{ firstName: string, lastName: string, contactType: string }] }>>()
    const navigate = useNavigate()

    createEffect(async () => {
        const _families = await fetch("/api/families")
        const familyData = await _families.json()
        setFamilies(familyData.data)
    })

    return (
        <Box>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Family Name</TableHead>
                        <TableHead>Contact Name</TableHead>
                        <TableHead>Contact Type</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <For each={families()}>
                        {(row) => 
                            {
                                const sortedRows = row.contacts.sort((a, b) => a.contactType.localeCompare(b.contactType))
                                return(
                            <>
                            <For each={sortedRows}>
                                {(member) => (
                                    <TableRow onClick={() => navigate(`/family/${row._id}`)} style={{ cursor: 'pointer' }}>
                                        <TableCell class='text-left'>{row.familyName}</TableCell>
                                        <TableCell class='text-left'>{member.firstName} {member.lastName}</TableCell>
                                        <TableCell class='text-left'>{member.contactType}</TableCell>
                                    </TableRow>
                                )}
                            </For>
                            </>)
                            }
                        }
                </For>
            </TableBody>
        </Table>
            {/* <Stack spacing={3}> */ }
    {/* <Grid cols={3}>
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
            </Grid> */}
    {/* </Stack> */ }
        </Box >
    )
}

export default FamilyList