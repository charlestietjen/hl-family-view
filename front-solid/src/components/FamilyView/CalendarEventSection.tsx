import { contact } from "~/contact"
import { Table, TableHead, TableHeader, TableBody, TableCell, TableRow } from "~/components/ui/table"
import { Accordion, AccordionTrigger, AccordionContent, AccordionItem } from "~/components/ui/accordion"
import { Typography } from "@suid/material"
import { For } from "solid-js"
import dayjs from "dayjs"

export const CalendarEventSection = ({ contacts }:
    {
        _id: string,
        familyName: string,
        contacts: contact[]
    }) => {
    const tableHeads: string[] = [
        // 'Event Id',
        'Title',
        'Appointment Status',
        'Appointment Date',
        'Created At',
        'Updated At'
    ]

    let noEvents = true
    contacts.forEach(contact => {
        if (contact.calendarEvents.length > 0) {
            noEvents = false
        }
    })

    if (noEvents) {
        return (
            <Typography>No Calendar Events</Typography>
        )
    }
    return (
        <Accordion collapsible>
            <AccordionItem value='calendar-events'>
                <AccordionTrigger>Events</AccordionTrigger>
                <AccordionContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {tableHeads.map((head) => (
                                    <TableHead>{head}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <For each={contacts}>
                                {(contact) => (
                                    <For each={contact.calendarEvents}>
                                        {(event) => (
                                            <TableRow>
                                                {/* <TableCell>{event.calendarEventId}</TableCell> */}
                                                <TableCell>{event.title}</TableCell>
                                                <TableCell>{event.appointmentStatus}</TableCell>
                                                <TableCell>{dayjs(event.startTime).format('DD MMM YYYY')}</TableCell>
                                                <TableCell>{dayjs(event.dateAdded).format('DD MMM YYYY')}</TableCell>
                                                <TableCell>{dayjs(event.dateUpdated).format('DD MMM YYYY')}</TableCell>
                                            </TableRow>
                                        )}
                                    </For>
                                )}
                            </For>
                        </TableBody>
                    </Table>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}