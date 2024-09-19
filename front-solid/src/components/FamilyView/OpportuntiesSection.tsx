import { For } from "solid-js"
import { contact } from "~/contact"
import { Table, TableHead, TableHeader, TableBody, TableCell, TableRow } from "~/components/ui/table"
import dayjs from "dayjs"

export const OpportunitiesSection = ({ contacts }:
    {
        _id: string,
        familyName: string,
        contacts: contact[]
    }) => {
    const tableHeads = [
        'Opportunity Id',
        'Opportunity Name',
        'Contact Name',
        'Status',
        'Created At',
        'Updated At',
    ]
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <For each={tableHeads}>
                        {(head) => (
                            <TableHead>
                                {head}
                            </TableHead>
                        )}
                    </For>
                </TableRow>
            </TableHeader>
            <TableBody>
                <For each={contacts}>
                    {(contact) => (
                        <>
                        <For each={contact.opportunities}>
                            {(opportunity) => (
                                <TableRow class='text-left'>
                                    <TableCell>
                                        {opportunity.opportunityId}
                                    </TableCell>
                                    <TableCell>
                                        {opportunity.name}
                                    </TableCell>
                                    <TableCell>
                                        {contact.firstName} {contact.lastName}
                                    </TableCell>
                                    <TableCell>
                                        {opportunity.status}
                                    </TableCell>
                                    <TableCell>
                                        {dayjs(opportunity.createdAt).format('DD/MM/YYYY')}
                                    </TableCell>
                                    <TableCell>
                                        {dayjs(opportunity.updatedAt).format('DD/MM/YYYY')}
                                    </TableCell>
                                </TableRow>
                                )
                            }
                        </For>
                        </>
                    )}
                </For>
            </TableBody>
        </Table>
    )
}   