import { contact } from "~/pages/FamilyView"
import { Table, TableHead, TableHeader, TableBody, TableCell, TableRow } from "~/components/ui/table"
import { For } from "solid-js"

export const ConversationSection = ({ contacts }:
    {
        _id: string,
        familyName: string,
        contacts: contact[]
    }) => {
    const tableHeads: string[] = [
        'Conversation Id',
        'Contact Name',
        'Last Message Body',
        'Last Message Type',
        'Unread Count',
    ]
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <For each={tableHeads}>
                        {(tableHead) =>
                            <TableHead>
                                {tableHead}
                            </TableHead>}
                    </For>
                </TableRow>
            </TableHeader>
            <TableBody>
                <For each={contacts}>
                    {contact => {
                        return (
                            <>
                                <For each={contact.conversations}>
                                    {conversation => (
                                        <TableRow class='text-left'>
                                            <TableCell>
                                                {conversation.conversationId}
                                            </TableCell>
                                            <TableCell>
                                                {conversation.contactName}
                                            </TableCell>
                                            <TableCell>
                                                {conversation.lastMessageBody? conversation.lastMessageBody.slice(0, 50) : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {conversation.lastMessageType}
                                            </TableCell>
                                            <TableCell>
                                                {conversation.unreadCount}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </For>
                            </>
                        )
                    }}
                </For>
            </TableBody>
        </Table>
    )
}