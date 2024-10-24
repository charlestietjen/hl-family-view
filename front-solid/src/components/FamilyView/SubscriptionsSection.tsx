import { contact } from "~/contact"
import { Table, TableHead, TableHeader, TableBody, TableCell, TableRow } from "~/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "~/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion"
import { For } from "solid-js"
import dayjs from "dayjs"
import { Button } from "~/components/ui/button"
import Typography from "@suid/material/Typography"

export const SubscriptionsSection = ({ contacts }:
    {
        _id: string,
        familyName: string,
        contacts: contact[]
    }) => {

    const tableHeads = [
        'Subscription Id',
        'Status',
        'Total Amount',
        'Contact Name',
        'Date Created',
        'Date Updated',
    ]

    const handleCancel = async (id: string) => {
        try {
            const response = await fetch('/api/subscription',
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: id })
                }
            )
            if (response.ok) {
                console.log('Subscription canceled')
            }
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <Accordion collapsible>
            <AccordionItem value="item-1">
                <AccordionTrigger>
                    <Typography variant='h6' textAlign="center">Subscriptions</Typography>
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
                                        <For each={contact.subscriptions}>
                                            {order =>
                                                <TableRow class='text-left'>
                                                    <TableCell>{order.subscriptionId}</TableCell>
                                                    <TableCell>{order.status}</TableCell>
                                                    <TableCell>${order.amount}</TableCell>
                                                    <TableCell>{contact.firstName} {contact.lastName}</TableCell>
                                                    <TableCell>{dayjs(order.createdAt).format('YYYY-MM-DD')}</TableCell>
                                                    <TableCell>{dayjs(order.updatedAt).format('YYYY-MM-DD')}</TableCell>
                                                    <TableCell>
                                                        <Dialog>
                                                            <DialogTrigger
                                                                as={Button<"button">}
                                                                variant="destructive"
                                                                disabled={order.status === 'active' ? false : true}
                                                            >
                                                                Cancel
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>
                                                                        Cancel Subscription
                                                                    </DialogTitle>
                                                                    <DialogDescription>
                                                                        Are you sure you want to cancel this subscription?
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <DialogFooter>
                                                                    <Button onClick={() => handleCancel(order.entityId)}>
                                                                        Yes
                                                                    </Button>
                                                                    <DialogTrigger
                                                                        as={Button<"button">}
                                                                        variant="secondary"
                                                                    >
                                                                        No
                                                                    </DialogTrigger>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </TableCell>
                                                    {/* <TableCell>
                                            <Button disabled={order.status === 'active' ? false : true}>
                                                Pause
                                            </Button>
                                        </TableCell> */}
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