import { db } from './db'
import { Token, Contact, Family, Order } from '../model/'
import { Transaction } from '../model/Transaction';

interface contact {
    [key: string]: any;
    campDates: null;
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
        if (!response.ok) {
            console.log("Fetch error: ", response)
            return
        }
        let data = await response.json();
        const contacts: [contact] = data.contacts.map((contact: contact) => {
            let contactType: String | null = null
            let program: String | null = null
            let paymentProvider: String | null = null
            let campDates: Date[] | null = null
            contact.customFields.forEach((field: { value: String | null }) => {
                if (field.value === 'Parent' || field.value === 'Student') {
                    contactType = field.value
                }
                if (field.value === 'Stripe' || field.value === 'Wave' || field.value === 'HighLevel') {
                    paymentProvider = field.value
                }
                if (field.value === 'Lite' || field.value === 'Pro' || field.value === 'Max') {
                    program = field.value
                }
                if (field.value?.startsWith('camp_')) {
                    campDates = field.value.split('camp_').filter((v) => v !== '').map((v) => new Date(v))
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
                program: program || 'Unknown',
                paymentProvider: paymentProvider || 'Unknown',
                campDates: campDates || null
            }
        })
        while (data.meta?.nextPageUrl) {
            const response = await fetch(data.meta.nextPageUrl, options);
            const _data = await response.json();
            const newContacts = _data.contacts.map((contact: contact) => {
                let contactType: String | null = null
                let program: String | null = null
                let paymentProvider: String | null = null
                let campDates: Date[] | null = null
                contact.customFields.forEach((field: { value: String | null }) => {
                    if (field.value === 'Parent' || field.value === 'Student') {
                        contactType = field.value
                    }
                    if (field.value === 'Stripe' || field.value === 'Wave' || field.value === 'HighLevel') {
                        paymentProvider = field.value
                    }
                    if (field.value === 'Lite' || field.value === 'Pro' || field.value === 'Max') {
                        program = field.value
                    }
                    if (field.value?.startsWith('camp_')) {
                        campDates = field.value.split('camp_').filter((v) => v !== '').map((v) => new Date(v))
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
                    program: program || 'Unknown',
                    paymentProvider: paymentProvider || 'Unknown',
                    campDates: campDates || null
                }
            })
            contacts.push(...newContacts)
            data = _data
        }
        const filteredContacts = contacts.filter(c => c)
        try {
            const existingContacts = await Contact.find()
            existingContacts.forEach(async contact => {
                try {
                    contact.set(filteredContacts.find(c => c.contactId === contact.contactId) || {})
                    contact.save()
                } catch (error) {
                    console.log(error)
                }
            })
            const newContacts = filteredContacts.filter(c => !existingContacts.find(contact => contact.contactId === c.contactId))
            const contactsToUpdate = filteredContacts.map(contact => {
                const existingContact: any = existingContacts.find(c => c.contactId === contact.contactId)
                if (existingContact && Object.keys(contact).some(key => contact[key] != existingContact[key])) {
                    // console.log(contact, existingContact)
                    return contact;
                }
                return;
            })
            // console.log(contactsToUpdate)
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
            let newOrders = orders.filter((o: {
                orderId: string;
            }) => !existingOrders.find(order => order.orderId === o.orderId))
            const promises = newOrders.map(async (order: any, i: string | number) => {
                const url = `https://services.leadconnectorhq.com/payments/orders/${order.orderId}?altId=${token.locationId}&altType=location`;
                const options = {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token.access_token}`, Version: '2021-07-28', Accept: 'application/json' }
                };

                try {
                    const response = await fetch(url, options);
                    const data = await response.json();
                    newOrders[i] = { ...order, product: data.items[0].product.name, productId: data.items[0].product._id, createdAt: data.createdAt, updatedAt: data.updatedAt }
                    // console.log(newOrders[i])
                } catch (error) {
                    console.error(error);
                }
            })
            await Promise.all(promises)
            const orderRecords = await Order.create(newOrders)
            // console.log(newOrders)
            try {
                const url = `https://services.leadconnectorhq.com/payments/transactions?altId=${token.locationId}&altType=location`;
                const options = {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token.access_token}`, Version: '2021-07-28', Accept: 'application/json' }
                };

                try {
                    const response = await fetch(url, options);
                    const { data } = await response.json();
                    while (data.meta?.nextPageUrl) {
                        const response = await fetch(data.meta.nextPageUrl, options);
                        const _data = await response.json();
                        data.push(..._data.data)
                        data.meta = _data.meta
                    }
                    const existingTransactions = await Transaction.find()
                    const newTransactions = existingTransactions.filter(t => !data.find((transaction: { _id: string; }) => transaction._id === t.transactionId))
                    const formattedTransactions = newTransactions.map((transaction:any) => {
                        return { ...transaction, transactionId: transaction._id }
                    })
                    await Transaction.create(formattedTransactions)
                } catch (error) {
                    console.error(error);
                }
            } catch (error) {
                console.log(error)
            }




            return { contactRecords, familyRecords, orderRecords }
        } catch (error) {
            throw error
        }
    } catch (error) {
        console.log(error);
        throw error
    }
}