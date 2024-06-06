import { Box, Stack, Typography, Table, TableBody, TableCell, TableContainer, TableRow } from "@suid/material"
import { accessToken, locationId, updateContactsDb, getFamilies, getContactById } from "../utils/Pocketbase";
import { JSX, createSignal, createEffect, For } from "solid-js";
import { RecordModel } from "pocketbase";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "~/components/ui/accordion"

const FamilyList = () => {
    const [contacts, setContacts] = createSignal<any[]>([])
    const [families, setFamilies] = createSignal<RecordModel[]>([])
    const url = `https://services.leadconnectorhq.com/contacts/?locationId=${locationId}&limit=100`
    const getContacts = async (url: string) => {
        const options = {
            method: 'GET',
            headers: { Authorization: `Bearer ${accessToken}`, Version: '2021-07-28', Accept: 'application/json' }
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            const newContacts = [...contacts(), ...data.contacts]
            setContacts(newContacts)
            if (data.meta.nextPageUrl) {
                getContacts(data.meta.nextPageUrl)
            } else {
                updateContactsDb(contacts())
                const _families = await getFamilies()
                setFamilies(_families)
            }
        } catch (error) {
            console.error(error);
        }
    }


    createEffect(() => {
        getContacts(url)
    })
    return (
        <Box>
            <For each={families()}>
                {(row) => (
                    <>
                        <Typography>{row.familyName}</Typography>
                        <For each={row.members}>
                            {(member) => (
                                <Typography>{member.firstName}</Typography>
                            )}
                        </For>
                    </>
                )}
            </For>
        </Box>
    )
}

export default FamilyList