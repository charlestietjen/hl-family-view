import PocketBase from 'pocketbase'

interface HighLevelToken {
    access_token: string,
    token_type: string,
    expires_in: number,
    refresh_token: string,
    scope: string,
    userType: string,
    locationId: string,
    companyId: string,
    approvedLocations: string[],
    userId: string,
    planId: string
}

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090')

export const isAuthValid = pb.authStore.isValid

export const login = async () => {
    try {
        const authData = await pb.collection('users').authWithPassword(import.meta.env.VITE_PB_USER, import.meta.env.VITE_PB_PASSWORD)
        return authData
    }
    catch (e: any) {
        if (e.status === 400) {
            await pb.collection('users').create({ username: import.meta.env.VITE_PB_USER, password: import.meta.env.VITE_PB_PASSWORD, passwordConfirm: import.meta.env.VITE_PB_PASSWORD })
            login()
        }
    }
}

export const storeHlToken = async (token: HighLevelToken) => {
    try {
        await pb.collection('users').update(pb.authStore.model?.id, { token: token, tokenIssued: Date.now() })
    }
    catch (e) {
        console.error(e)
    }
}

export const hlTokenExpired = () => {
    const token = pb.authStore.model?.token
    if (!token) {
        return true
    }
    return Date.now() > pb.authStore.model?.tokenIssued + token.expires_in * 1000
}

export const updateContactsDb = async (contacts: any[]) => {
    let existingContacts = await pb.collection('contacts').getFullList({ sort: '-created' })
    contacts.forEach(async contact => {
        if (existingContacts.find(c => c.remote_id === contact.id)) {
            try {
                pb.collection('contacts').update(existingContacts.find(c => c.remote_id === contact.id)!.id, { ...contact, id: null, remote_id: contact.id })
            }
            catch (e) {
                console.error(e)
            }
        } else {
            try {
                const record = await pb.collection('contacts').create({ ...contact, id: null, remote_id: contact.id })
                existingContacts.push(record)
            }
            catch (e) {
                console.error(e)
            }
        }
    })
    let existingFamilies = await pb.collection('families').getFullList({ sort: '-created' })
    existingContacts.forEach(async contact => {
        const family = existingFamilies.find(f => f.familyName === contact.companyName)
        if (!family) {
            try {
                const record = await pb.collection('families').create({ familyName: contact.companyName, members: [contact.id] })
                existingFamilies.push(record)
            }
            catch (e) {
                console.error(e)
            }
        } else if (!family.members.includes(contact.id)) {
            try {
                await pb.collection('families').update(family!.id, { members: [...family!.members, contact.id] }).then(res => {
                    existingFamilies[existingFamilies.findIndex(f => f === family)] = res
                })
            }
            catch (e) {
                console.error('Family update error', e)
            }
        }
    })
}

export const getFamilies = async () => {
    try {
        return await pb.collection('families').getFullList({ sort: 'familyName' })
    }
    catch (e) {
        console.error(e)
        return []
    }
}

export const getContactById = async (id: string) => {
    try {
        return await pb.collection('contacts').getOne(id)
    }
    catch (e) {
        console.error(e)
    }
}

export const getFamily = async (id: string) => {
    try {
        return await pb.collection('families').getOne(id, { expand: 'members' })
    }
    catch (e) {
        console.log(e)
    }
}

export const getToken = () => {return pb.authStore.model?.token}

export const accessToken = pb.authStore.model?.token.access_token

export const locationId = pb.authStore.model?.token.locationId