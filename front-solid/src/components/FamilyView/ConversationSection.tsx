import { contact } from "~/contact"
import { Table, TableHead, TableHeader, TableBody, TableCell, TableRow } from "~/components/ui/table"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "~/components/ui/collapsible"
import { For } from "solid-js"
import { Stack, Typography } from "@suid/material"
import dayjs from "dayjs"
import { FaSolidChevronDown } from 'solid-icons/fa'

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
    const messagesHeads: string[] = [
        'Message Id',
        'Date Added',
        'Message Body',
    ]
    return (
        <Stack spacing={3}>
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
                                                    {conversation.lastMessageBody ? conversation.lastMessageBody.slice(0, 50) : 'N/A'}
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
            <For each={contacts}>
                {contact => (

                    <For each={contact.conversations}>
                        {conversation => (
                            <Collapsible>
                                <CollapsibleTrigger>
                                    <Stack direction="row" spacing={2}>
                                        <Typography variant="h6">Messages for Conversation Id: {conversation.conversationId}</Typography>
                                        <FaSolidChevronDown />
                                    </Stack>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <For each={messagesHeads}>
                                                    {(tableHead) =>
                                                        <TableHead>
                                                            {tableHead}
                                                        </TableHead>}
                                                </For>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <For each={conversation.messages}>
                                                {message => (

                                                    <TableRow class='text-left'>
                                                        <TableCell>
                                                            {message.id}
                                                        </TableCell>
                                                        <TableCell>
                                                            {dayjs(message.dateAdded).format('YYYY-MM-DD')}
                                                        </TableCell>
                                                        <TableCell style={{ width: '75%' }}>
                                                            {typeof message.body === 'string' ? message.body.slice(0, 200): "N/A"}
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </For>
                                        </TableBody>
                                    </Table>
                                </CollapsibleContent>
                            </Collapsible>
                        )}
                    </For>
                )}
            </For>
        </Stack >
    )
}