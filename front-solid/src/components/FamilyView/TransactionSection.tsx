import { For } from "solid-js"
import { contact } from "~/contact"
import { Table, TableHead, TableHeader, TableBody, TableCell, TableRow } from "~/components/ui/table"

export const TransactionSection = ({ contacts }: { contacts: contact[] }) => {
    const tableHeads = [
        'Transaction Id',
        'Order Id',
        'Amount',
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
                    {contact => (
                        <>
                            <For each={contact.transactions}>
                                {transactions => (
                                    <TableRow class='text-left'>
                                        <TableCell>{transactions.transactionId}</TableCell>
                                        <TableCell>{transactions.entitySourceId}</TableCell>
                                        <TableCell>{transactions.amount}</TableCell>
                                        <TableCell>{transactions.contactName}</TableCell>
                                        <TableCell>{transactions.status}</TableCell>
                                        <TableCell>{transactions.createdAt}</TableCell>
                                        <TableCell>{transactions.updatedAt}</TableCell>
                                    </TableRow>
                                ) }
                            </For>
                        </>
                    )}
                </For>
            </TableBody>
        </Table>
    )
}