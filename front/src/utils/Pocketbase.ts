import PocketBase from 'pocketbase'

const pb = new PocketBase('http://127.0.0.1:8090')

export const isAuthValid = pb.authStore.isValid
export const login = async () => {
    try {
        const authData = await pb.collection('users').authWithPassword(import.meta.env.VITE_PB_USER, import.meta.env.VITE_PB_PASSWORD)
        return authData
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (e: any) {
        if (e.status === 400) {
            await pb.collection('users').create({ username: import.meta.env.VITE_PB_USER, password: import.meta.env.VITE_PB_PASSWORD, passwordConfirm: import.meta.env.VITE_PB_PASSWORD })
            login()
        }
    }
}