import { For } from "solid-js"
import { contact } from "~/contact"
import { Table, TableHead, TableHeader, TableBody, TableCell, TableRow } from "~/components/ui/table"
import { Accordion, AccordionTrigger, AccordionContent, AccordionItem } from "~/components/ui/accordion"
import { Typography } from "@suid/material"
import dayjs from "dayjs"

export const OpportunitiesSection = ({ contacts }:
    {
        _id: string,
        familyName: string,
        contacts: contact[]
    }) => {
    const tableHeads = [
        // 'Opportunity Id',
        'Opportunity Name',
        'Contact Name',
        'Stage',
        'Created At',
        'Updated At',
    ]
    return (
        <Accordion collapsible>
            <AccordionItem value='opportunities'>
                <AccordionTrigger>
                    <Typography variant="h6">
                        Opportunities
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
                                {(contact) => (
                                    <>
                                        <For each={contact.opportunities}>
                                            {(opportunity) => (
                                                <TableRow class='text-left'>
                                                    {/* <TableCell>
                                                    {opportunity.opportunityId}
                                                </TableCell> */}
                                                    <TableCell>
                                                        {opportunity.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {contact.firstName} {contact.lastName}
                                                    </TableCell>
                                                    <TableCell>
                                                        {opportunity.pipelineStage}
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
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}   