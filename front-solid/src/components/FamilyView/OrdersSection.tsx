import { contact } from "~/contact"
import { Table, TableHead, TableHeader, TableBody, TableCell, TableRow } from "~/components/ui/table"
import { Accordion, AccordionTrigger, AccordionContent, AccordionItem } from "~/components/ui/accordion"
import { For } from "solid-js"
import dayjs from "dayjs"
import { Typography } from "@suid/material"

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
        <Accordion collapsible>
            <AccordionItem value='orders'>
                <AccordionTrigger>
                    <Typography variant="h6">
                    Order History
                    </Typography>
                </AccordionTrigger>
                <AccordionContent>
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
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}