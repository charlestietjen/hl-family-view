import { Token } from "../model"
import { refreshToken, initializeDb } from "./highlevel"

export const timedAuthRefresh = () => {
    console.log('Starting scheduled token refresh...')
    refreshToken()
    setInterval(async () => {
        console.log('Starting scheduled token refresh...')
        refreshToken()
    }, 1000 * 60 * 8)
}

export const timedDbReinitialize = async () => {
    console.log('Reinitializing Db')
    const tokens = await Token.find()
    if (tokens.length < 1 || tokens[0].refresh_token === undefined || tokens[0].refresh_token === null) {
        console.log("No token available to reinit db")
        return
    }
    const token = tokens[0]
    initializeDb(token)
    setInterval(async () => {
        console.log('Reinitializing Db')
        const tokens = await Token.find()
        if (tokens.length < 1 || tokens[0].refresh_token === undefined || tokens[0].refresh_token === null) {
            console.log("No token available to reinit db")
            return
        }
        const token = tokens[0]
        initializeDb(token)
    }, 1000 * 60 * 10)
}