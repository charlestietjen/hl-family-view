import { contact } from "~/pages/FamilyView"
import { Table, TableHead, TableHeader, TableBody, TableCell, TableRow } from "~/components/ui/table"
import { For } from "solid-js"
import dayjs from "dayjs"

export const OrdersSection = ({ contacts }:
    {
        _id: string,
        familyName: string,
        contacts: contact[]
    }) => {
        const tableHeads = [
            'Order Id',
            'Product Name',
            'Total Amount',
            'Status',
            'Contact Name',
            'Date Created',
            'Date Updated',
        ]
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <For each={tableHeads}>
                        {(head) =>
                            <TableHead>
                                {head}
                            </TableHead>
                        }
                    </For>
                </TableRow>
            </TableHeader>
            <TableBody>
                <For each={contacts}>
                    {contact =>
                        <>
                            <For each={contact.orders}>
                                {order =>
                                    <TableRow class='text-left'>
                                        <TableCell>{order.orderId}</TableCell>
                                        <TableCell>{order.items[0].name}</TableCell>
                                        <TableCell>${order.amount}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell>{contact.firstName} {contact.lastName}</TableCell>
                                        <TableCell>{dayjs(order.createdAt).format('YYYY-MM-DD')}</TableCell>
                                        <TableCell>{dayjs(order.updatedAt).format('YYYY-MM-DD')}</TableCell>
                                    </TableRow>
                                }
                            </For>
                        </>
                    }
                </For>
            </TableBody>
        </Table>
    )
}