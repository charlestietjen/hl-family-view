import { Box, Stack } from "@suid/material"
import { accessToken, locationId, updateContactsDb, getFamilies } from "../utils/Pocketbase";
import { createSignal, createEffect, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { RecordModel } from "pocketbase";
import {
    Card,
    CardHeader,
    CardTitle
} from "~/components/ui/card"

const FamilyList = () => {
    const [contacts, setContacts] = createSignal<any[]>([])
    const [families, setFamilies] = createSignal<RecordModel[]>([])
    const navigate = useNavigate()

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
            <Stack spacing={3}>
                <For each={families()}>
                    {(row) => (
                        <Card onClick={() => navigate(`/family/${row.id}`)}>
                            <CardHeader>
                                <CardTitle>{row.familyName}</CardTitle>
                            </CardHeader>
                        </Card>
                    )}
                </For>
            </Stack>
        </Box>
    )
}

export default FamilyList