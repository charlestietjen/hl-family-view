import { UCToken, Contact } from "../model"
import { decode, JwtPayload } from "jsonwebtoken"
import dayjs from "dayjs"

export const refreshToken = async () => {
    let record = await UCToken.findOne({})
    const decoded = await decode(record?.token || "")
    if (decoded !== null && typeof decoded !== "string" && decoded?.exp! > Date.now() / 1000) {
        console.log("UC Token not expired")
        return
    }
    try {
        const url = "https://node-api.ultimatecoders.ca/api/v1/users/authenticate"
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: process.env.PORTAL_USER || "admin",
                password: process.env.PORTAL_PW || "password"
            })
        })
        const token = await response.json()
        if (record) {
            record.set({ ...token })
        } else {
            record = new UCToken({ ...token })
        }
        record.save()
    } catch (error) {
        console.error(error)
    }
}

export const getCampRegistrations = async () => {
    try {
        const tokenRecord = await UCToken.findOne({})
        if (!tokenRecord) {
            console.log("No token record found")
            return
        }

        const token = tokenRecord.token
        const url = `https://node-api.ultimatecoders.ca/api/v1/campregistrations?selectedyear=${new Date().getFullYear()}`

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (!response) {
            console.log("No response")
            return
        }

        const data = await response.json()

        let newRegistrations = data.data.map((registration: any) => {
            if (new Date(registration.uccampstartdate) > new Date()) {
                return registration
            }
        })

        newRegistrations = newRegistrations.filter((registration: any) => registration !== undefined)

        const contacts = await Contact.find()

        newRegistrations = newRegistrations.map((registration: any) => {
            if (!contacts.find((c) => c.email === registration.ucprimaryemail)?.email) {
                return {
                    name: registration.ucparentname,
                    email: registration.ucprimaryemail,
                    phone: registration.ucprimaryphone,
                    companyName: `${registration.ucparentname.split(' ')[registration.ucparentname.split(' ').length - 1]} Family`,
                    tags: [`camp_registration_${dayjs(registration.uccampstartdate).format('YYYY-MM-DD')}`],
                }
            }
        })
        return newRegistrations
    } catch (error) {
        console.error(error)
    }
}

export const getActiveRegistrations = async () => {
    try {
        const tokenRecord = await UCToken.findOne({})
        if (!tokenRecord) {
            console.log("No token record found")
            return
        }
        const token = tokenRecord.token
        const url = `https://node-api.ultimatecoders.ca/api/v1/registrations/active`

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (!response) {
            console.log("No response")
            return
        }
        const data = await response.json()
        
        const contacts = await Contact.find()

        let newRegistrations = data.data.map((registration: any) => {
            if (!contacts.find((c) => c.email === registration.ucprimaryemail)?.email) {
                return {
                    name: registration.ucparentname,
                    email: registration.ucprimaryemail,
                    phone: registration.ucprimaryphone,
                    companyName: `${registration.ucparentname.split(' ')[registration.ucparentname.split(' ').length - 1]} Family`,
                    tags: [`active_registration`],
                }
            }
        })
        newRegistrations = newRegistrations.filter((registration: any) => registration !== undefined)
        return newRegistrations
    } catch (error) {
        console.error(error)
    }
}