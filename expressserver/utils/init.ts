import { Token } from "../model"
import { initializeDb } from "./highlevel"

export const startupDatabaseSync = async (): Promise<any> => {
    console.log('Initializing Db')
    const tokens = await Token.find()
    if (tokens.length < 1 || tokens[0].refresh_token === undefined || tokens[0].refresh_token === null) {
        console.log("No token available to reinit db")
        return
    }
    const _token = tokens[0]
    initializeDb(_token)
}