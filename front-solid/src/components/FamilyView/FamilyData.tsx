import dayjs from 'dayjs'
import { For } from 'solid-js'
import { Table, TableRow, TableCell, TableHead, TableHeader, TableBody } from '~/components/ui/table'
import { contact } from '~/pages/FamilyView'

export const FamilyData = ({ _id, familyName, contacts }:
    {
        _id: string,
        familyName: string,
        contacts: contact[]
    }) => {

    const sortedContacts = contacts.sort((a, b) => a.contactType.localeCompare(b.contactType))


    const tableHeads = [
        'Family ID',
        'Family Name',
        'Contact Name',
        'Contact Type',
        'Product Name',
        'Subscription Status',
        'Date Created',
        'Date Updated',
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
                <For each={sortedContacts}>
                    {(contact) => {
                        let subscriptionStatus = 'Unknown';
                        if (contact.subscriptions.length > 0) {
                            subscriptionStatus = contact.subscriptions[0].status;
                        }
                        const ordersByDate = contact.orders?.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix()) || [];
                        return (
                            <>
                                <TableRow>
                                    <TableCell class='text-left'>
                                        {_id}
                                    </TableCell>
                                    <TableCell class='text-left'>
                                        {familyName}
                                    </TableCell>
                                    <TableCell class='text-left'>
                                        {`${contact.firstName} ${contact.lastName}`}
                                    </TableCell>
                                    <TableCell class='text-left'>
                                        {contact.contactType}
                                    </TableCell>
                                    <TableCell class='text-left'>
                                        {ordersByDate?.[0]?.items[0]?.name || "N/A"}
                                    </TableCell>
                                    <TableCell class='text-left'>
                                        {subscriptionStatus}
                                    </TableCell>
                                    <TableCell class='text-left'>
                                        {dayjs(contact.createdAt).format('YYYY-MM-DD')}
                                    </TableCell>
                                    <TableCell class='text-left'>
                                        {dayjs(contact.updatedAt).format('YYYY-MM-DD')}
                                    </TableCell>
                                </TableRow>
                            </>
                        );
                    }}
                </For>
            </TableBody>
        </Table>
    )
}