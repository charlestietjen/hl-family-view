import { contact } from "~/contact"
import { Table, TableHead, TableHeader, TableBody, TableCell, TableRow } from "~/components/ui/table"
import { For } from "solid-js"
import dayjs from "dayjs"

export const CalendarEventSection = ({ contacts }:
    {
        _id: string,
        familyName: string,
        contacts: contact[]
    }) => {
    const tableHeads: string[] = [
        'Event Id',
        'Title',
        'Appointment Status',
        'Appointment Date',
        'Created At',
        'Updated At'
    ]
    return (
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
                                    <TableCell>{event.calendarEventId}</TableCell>
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
    )
}