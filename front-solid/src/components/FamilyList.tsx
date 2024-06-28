import { Box, Stack } from "@suid/material"
import { createSignal, createEffect, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { RecordModel } from "pocketbase";
import {
    Card,
    CardHeader,
    CardTitle
} from "~/components/ui/card"

const FamilyList = () => {
    const [families, setFamilies] = createSignal<RecordModel[]>([])
    const navigate = useNavigate()

    createEffect(async () => {
        const _families = await fetch("/api/families")
        const familyData = await _families.json()
        setFamilies(familyData.data)
    })

    return (
        <Box>
            <Stack spacing={3}>
                <For each={families()}>
                    {(row) => (
                        <Card onClick={() => navigate(`/family/${row._id}`)}>
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