import { db } from './db'
import { Token, Contact, Family, Order } from '../model/'

interface contact {
    id: any;
    contactId: string;
    customFields: [{ value: String | null }];
    companyName: String;
    firstNameRaw: String;
    lastNameRaw: String;
    email: String;
    locationId: String;
    source: String;
    dateAdded: Number;
    tags: String[];
    businessId: String;
    contactType: String;
    program: String;
}

export const refreshToken = async () => {
    console.log("Refresh token called")
    const tokens = await Token.find()
    if (tokens.length < 1 || tokens[0].refresh_token === undefined || tokens[0].refresh_token === null) {
        console.log("No refresh token found")
        return
    }

    const token = tokens[0]
    const tokenExpired = Date.now() - token.tokenIssued > 1000 * 60 * 60 * 24
    if (!tokenExpired) {
        console.log("Token not expired")
        return
    }
    console.log("Token expired, refreshing")
    const url = 'https://services.leadconnectorhq.com/oauth/token'
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json'
        },
        body: new URLSearchParams({
            client_id: process.env.CLIENT_ID || '',
            client_secret: process.env.CLIENT_SECRET || '',
            grant_type: 'refresh_token',
            code: token.authCode || '',
            refresh_token: token.refresh_token || '',
            user_type: token.userType || '',
            redirect_uri: ''
        })
    }
    try {
        const response = await fetch(url, options)
        const record = await response.json()
        const existingToken = await Token.findOne({ locationId: record.locationId })
        if (existingToken) {
            existingToken.set({ ...record, tokenIssued: Date.now() })
            console.log("Token refreshed")
            existingToken.save()
        }
    } catch (error) {
        console.error(error)
    }
}

export const initializeDb = async (_token: { locationId: String, access_token: String }): Promise<any> => {
    const tokenRecords: any = await Token.find()
    const token: any = tokenRecords ? tokenRecords[0] : null
    const url = `https://services.leadconnectorhq.com/contacts/?locationId=${token.locationId}&limit=100`;
    const options = {
        method: 'GET',
        headers: { Authorization: `Bearer ${token.access_token}`, Version: '2021-07-28', Accept: 'application/json' }
    };

    try {
        const response = await fetch(url, options);
        let data = await response.json();
        const contacts: [contact] = data.contacts.map((contact: contact) => {
            let contactType: String | null = null
            let program: String | null = null
            let paymentProvider: String | null = null
            contact.customFields.forEach((field: { value: String | null }) => {
                if (field.value === 'Parent' || field.value === 'Student') {
                    contactType = field.value
                }
            })
            contact.customFields.forEach((field: { value: String | null }) => {
                if (field.value === 'Lite' || field.value === 'Pro' || field.value === 'Max') {
                    program = field.value
                }
            })
            contact.customFields.forEach((field: { value: String | null }) => {
                if (field.value === 'Stripe' || field.value === 'Wave' || field.value === 'HighLevel') {
                    paymentProvider = field.value
                }
            })
            if (!contactType) {
                return
            }
            return {
                contactId: contact.id,
                companyName: contact.companyName,
                firstName: contact.firstNameRaw,
                lastName: contact.lastNameRaw,
                email: contact.email,
                locationId: contact.locationId,
                source: contact.source,
                dateAdded: contact.dateAdded,
                customFields: contact.customFields,
                tags: contact.tags,
                businessId: contact.businessId,
                contactType: contactType,
                program: program,
                paymentProvider: paymentProvider,
            }
        })
        while (data.meta?.nextPageUrl) {
            const response = await fetch(data.meta.nextPageUrl, options);
            const _data = await response.json();
            const newContacts = _data.contacts.map((contact: contact) => {
                let contactType: String | null = null
                let program: String | null = null
                let paymentProvider: String | null = null
                contact.customFields.forEach((field: { value: String | null }) => {
                    if (field.value === 'Parent' || field.value === 'Student') {
                        contactType = field.value
                    }
                })
                contact.customFields.forEach((field: { value: String | null }) => {
                    if (field.value === 'Lite' || field.value === 'Pro' || field.value === 'Max') {
                        program = field.value
                    }
                })
                contact.customFields.forEach((field: { value: String | null }) => {
                    if (field.value === 'Stripe' || field.value === 'Wave' || field.value === 'HighLevel') {
                        paymentProvider = field.value
                    }
                })
                if (!contactType) {
                    return
                }
                return {
                    contactId: contact.id,
                    companyName: contact.companyName,
                    firstName: contact.firstNameRaw,
                    lastName: contact.lastNameRaw,
                    email: contact.email,
                    locationId: contact.locationId,
                    source: contact.source,
                    dateAdded: contact.dateAdded,
                    customFields: contact.customFields,
                    tags: contact.tags,
                    businessId: contact.businessId,
                    contactType: contactType,
                    program: program,
                    paymentProvider: paymentProvider,
                }
            })
            contacts.push(...newContacts)
            data = _data
        }
        const filteredContacts = contacts.filter(c => c)
        try {
            const existingContacts = await Contact.find()
            const newContacts = filteredContacts.filter(c => !existingContacts.find(contact => contact.contactId === c.contactId))
            const contactRecords = await Contact.create(newContacts)
            const families = filteredContacts.map(c => (c.companyName))
            const uniqueFamilies = Array.from(new Set(families));
            const familyData = uniqueFamilies.map(family => {
                return { familyName: family }
            })
            const existingFamilies = await Family.find()
            const newFamilies = familyData.filter(f => !existingFamilies.find(family => family.familyName === f.familyName))
            const familyRecords = await Family.create(newFamilies)

            const url = `https://services.leadconnectorhq.com/payments/orders?altId=${token.locationId}&altType=location`;
            const options = {
                method: 'GET',
                headers: { Authorization: `Bearer ${token.access_token}`, Version: '2021-07-28', Accept: 'application/json' }
            };

            const orderResponse = await fetch(url, options);
            let orderData = await orderResponse.json();
            const orders = orderData.data.map((order: { _id: String; }) => {
                return { ...order, orderId: order._id }
            })
            while (orderData.meta?.nextPageUrl) {
                const orderResponse = await fetch(orderData.meta.nextPageUrl, options);
                const _orderData = await orderResponse.json();
                const newOrders = _orderData.data.map((order: { _id: String; }) => {
                    return { ...order, orderId: order._id }
                })
                orders.push(...newOrders)
                orderData = _orderData
            }
            const existingOrders = await Order.find()
            const newOrders = orders.filter((o: {
                orderId: string;
            }) => !existingOrders.find(order => order.orderId === o.orderId))
            const orderRecords = await Order.create(newOrders)

            return { contactRecords, familyRecords, orderRecords }
        } catch (error) {
            throw error
        }
    } catch (error) {
        console.log(error);
        throw error
    }
}