import { Box } from "@suid/material"
import { createSignal, createEffect, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import * as CryptoJs from 'crypto-js'

const FamilyList = () => {
    const [families, setFamilies] = createSignal<Array<{ _id: string, familyName: string, contacts: [{ firstName: string, lastName: string, contactType: string }] }>>()
    const navigate = useNavigate()

    createEffect(async () => {
        const _families = await fetch("/api/families")
        const familyData = await _families.json()
        setFamilies(familyData.data)
    })

    createEffect(async () => {
        console.log("requesting user data")
        const key : string = await new Promise((resolve, reject) => {
            window.parent.postMessage({ message: "REQUEST_USER_DATA" }, "*");
            window.addEventListener("message", ({ data }) => {
                if (data.message === "REQUEST_USER_DATA_RESPONSE") {
                    resolve(data.payload)
                } else {
                    reject(data.payload)
                }
            })
        })
        const decryptedKey = await CryptoJs.AES.decrypt(key, import.meta.env.VITE_SSO_KEY).toString(CryptoJs.enc.Utf8)
        console.log(decryptedKey)
    })

    return (
        <Box>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Family Name</TableHead>
                        <TableHead>Contact Name</TableHead>
                        <TableHead>Contact Type</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <For each={families()}>
                        {(row) => 
                            {
                                const sortedRows = row.contacts.sort((a, b) => a.contactType.localeCompare(b.contactType))
                                return(
                            <>
                            <For each={sortedRows}>
                                {(member) => (
                                    <TableRow onClick={() => navigate(`/family/${row._id}`)} style={{ cursor: 'pointer' }}>
                                        <TableCell class='text-left'>{row.familyName}</TableCell>
                                        <TableCell class='text-left'>{member.firstName} {member.lastName}</TableCell>
                                        <TableCell class='text-left'>{member.contactType}</TableCell>
                                    </TableRow>
                                )}
                            </For>
                            </>)
                            }
                        }
                </For>
            </TableBody>
        </Table>
        </Box >
    )
}

export default FamilyList