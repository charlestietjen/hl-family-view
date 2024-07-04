export const getToken = async () => {
    const res = await fetch('/api/token')
    const token = await res.json()
    // console.log(token.data)
    if (!token) {
        return
    }
    return token.data
}

export const postToken = async (token: any) => {
    const res = await fetch('/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(token)
    })
    const data = await res.json()
    if (!data.body?.token) {
        return
    }
    return data
}