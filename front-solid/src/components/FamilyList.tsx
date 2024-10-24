import { Box } from "@suid/material"
import { createSignal, createEffect, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { contact } from "~/contact";

const FamilyList = () => {
    const [families, setFamilies] = createSignal<Array<{ _id: string, familyName: string, contacts: contact[] }>>()
    const navigate = useNavigate()

    createEffect(async () => {
        const _families = await fetch("/api/families")
        const familyData = await _families.json()
        const familiesWithContacts = familyData.data.map((family: { contacts: string | any[]; }) => {
            if (family.contacts.length > 0) {
                return family
            } else {
                return
            }
        })
    console.log(familyData.data)
    setFamilies(familiesWithContacts)
})

return (
    <Box>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Primary Contact</TableHead>
                    <TableHead>Opportunity Stage</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <For each={families()}>
                    {(row) => {
                        const primaryContact = row.contacts.find(c => c.contactType === 'Parent') || row.contacts[0]
                        // const sortedRows = row.contacts.sort((a, b) => a.contactType.localeCompare(b.contactType))
                        const opportunity = primaryContact.opportunities[0] || { status: 'None' }
                        return (
                            <>
                                <TableRow onClick={() => navigate(`/family/${row._id}`)} style={{ cursor: 'pointer' }}>
                                    <TableCell class='text-left'>{row.familyName}</TableCell>
                                    <TableCell class='text-left'>{primaryContact.firstName} {primaryContact.lastName}</TableCell>
                                    <TableCell class='text-left'>{opportunity.pipelineStage}</TableCell>
                                </TableRow>
                            </>)
                    }
                    }
                </For>
            </TableBody>
        </Table>
    </Box >
)
}

export default FamilyList