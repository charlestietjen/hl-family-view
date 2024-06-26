import { db } from '../utils/db'
import { Token } from '../model/Token'

export const refreshToken = async (refreshToken) => {
    const tokens = await db.collection('tokens').findAll()
    if (tokens.length < 1) {
        return
    }

    const token = tokens[0]
    const tokenExpired = Date.now() - token.tokenIssued > 1000 * 60 * 60 * 24
    if (tokenExpired) {
        return
    }
    const url = 'https://services.leadconnectorhq.com/oauth/token'
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json'
        },
        body: new URLSearchParams({
            client_id: import.meta.env.CLIENT_ID,
            client_secret: import.meta.env.CLIENT_SECRET,
            grant_type: 'refresh_token',
            code: token.code,
            refresh_token: token.refreshToken,
            user_type: token.user_type,
            redirect_uri: ''
        })
    }
    try {
        const response = await fetch(url, options)
        const record = await response.json()
        const existingToken = await db.collection('tokens').findOne({ locationId: record.locationId })
        if (existingToken) {
            existingToken.set({...record, tokenIssued: Date.now()})
            existingToken.save()
        }
    } catch (error) {
        console.error(error)
    }
}