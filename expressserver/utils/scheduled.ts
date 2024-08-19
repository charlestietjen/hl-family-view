import { Token } from "../model"
import { refreshToken, initializeDb, postContacts } from "./highlevel"
import { minutes, hours } from "./helpers"
import { getActiveRegistrations, getCampRegistrations } from "./ucportal"

export const timedAuthRefresh = () => {
    console.log('Starting scheduled token refresh...')
    refreshToken()
    setInterval(async () => {
        console.log('Starting scheduled token refresh...')
        refreshToken()
    }, hours(8))
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
    }, minutes(10))
}

export const timedCampRefresh = async () => {
    console.log('Starting camp refresh')
    const token = await Token.findOne({})
    if (!token) {
        console.log("No token found")
        return
    }
    const newRegistrations = await getCampRegistrations()
    postContacts(token, newRegistrations)
    console.log('Camp refresh finished')
    setInterval(async () => {
        console.log('Starting camp refresh')
        const token = await Token.findOne({})
        if (!token) {
            console.log("No token found")
            return
        }
        const newRegistrations = await getCampRegistrations()
        postContacts(token, newRegistrations)
        console.log('Camp refresh finished')
    }, minutes(30))
}

export const timedActiveRegistrationsRefresh = async () => {
    console.log('Starting active registrations refresh')
    const token = await Token.findOne({})
    if (!token) {
        console.log("No token found")
        return
    }
    const newRegistrations = await getActiveRegistrations()
    // console.log(newRegistrations)
    postContacts(token, newRegistrations)
    console.log('Active registrations refresh finished')
    setInterval(async () => {
        console.log('Starting active registrations refresh')
        const token = await Token.findOne({})
        if (!token) {
            console.log("No token found")
            return
        }
        const newRegistrations = await getActiveRegistrations()
        postContacts(token, newRegistrations)
        console.log('Active registrations refresh finished')
    }, minutes(30))
}