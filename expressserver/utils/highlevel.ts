import { db } from './db'
import { Token, Contact, Family, Order, CalendarEvent, Calendar, Conversation, Opportunity, Product, Campaign, Subscription } from '../model/'
import { Transaction } from '../model/Transaction';
import { Document, Types } from 'mongoose';
import { setTimeout } from 'timers/promises';

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
    const [token] = await Token.find()

    const rawContacts = await getContacts(token) || []
    const formattedContacts = rawContacts.map((contact: contact) => {
        let contactType: String | null = null
        let program: String | null = null
        let paymentProvider: String | null = null
        let campDates: Date[] | null = null
        contact.customFields?.forEach((field: { value: String | null }) => {
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
    const filteredContacts = formattedContacts.filter((c: any) => c)
    getOpportunities(token)
    await setTimeout(1000)
    getConversations(token)
    await setTimeout(1000)
    const calendars = await getCalendars(token) || []
    await setTimeout(1000)
    getCalendarEvents(token, calendars)
    await setTimeout(1000)
    getProducts(token)
    await setTimeout(1000)
    getCampaigns(token)
    await setTimeout(1000)
    getSubscriptions(token)
    await setTimeout(1000)
    getOrders(token)
    getTransactions(token)
    try {
        const existingContacts = await Contact.find()
        existingContacts.forEach(async contact => {
            try {
                contact.set(filteredContacts.find((c: { contactId: string; }) => c.contactId === contact.contactId) || {})
                contact.save()
            } catch (error) {
                console.log(error)
            }
        })
        const newContacts = filteredContacts.filter((c: { contactId: string; }) => !existingContacts.find(contact => contact.contactId === c.contactId))
        const contactRecords = await Contact.create(newContacts)
        const families = filteredContacts.map((c: { companyName: any; }) => (c.companyName))
        const uniqueFamilies = Array.from(new Set(families));
        const familyData = uniqueFamilies.map(family => {
            return { familyName: family }
        })
        const existingFamilies = await Family.find()
        const newFamilies = familyData.filter(f => !existingFamilies.find(family => family.familyName === f.familyName))
        const familyRecords = await Family.create(newFamilies)
        console.log("Database Reinit Done")
        return { contactRecords, familyRecords }
    } catch (error) {
        throw error
    }
}

const getTransactions = async (token: { access_token: string; locationId: string; }) => {
    const url = `https://services.leadconnectorhq.com/payments/transactions?altId=${token.locationId}&altType=location`;
    const options = {
        method: 'GET',
        headers: { Authorization: `Bearer ${token.access_token}`, Version: '2021-07-28', Accept: 'application/json' }
    };

    try {
        let response = await fetch(url, options);
        while (response.status === 429) {
            await setTimeout(1000)
            response = await fetch(url, options);
        }
        let { data = [], meta = {} } = await response.json()
        while (meta?.nextPageUrl) {
            let response = await fetch(meta.nextPageUrl, options);
            while (response.status === 429) {
                await setTimeout(1000)
                response = await fetch(meta.nextPageUrl, options);
            }
            const { data: _transactions = [], meta: _meta = {} } = await response.json();
            data.push(..._transactions)
            meta = _meta
        }
        const existingTransactions = await Transaction.find()
        const newTransactions = data.filter((t: any) => !existingTransactions.find(transaction => transaction.transactionId === t._id))
        const formattedTransactions = newTransactions.map((transaction: any) => {
            return { ...transaction, transactionId: transaction._id }
        })
        await Transaction.create(formattedTransactions)
    } catch (error) {
        console.error(error);
    }
}

const getContacts = async (token: { access_token: string; locationId: string; }) => {
    const url = `https://services.leadconnectorhq.com/contacts/?locationId=${token.locationId}&limit=100`;
    const options = {
        method: 'GET',
        headers: { Authorization: `Bearer ${token.access_token}`, Version: '2021-07-28', Accept: 'application/json' }
    };

    try {
        let response = await fetch(url, options);
        while (response.status === 429) {
            await setTimeout(1000)
            response = await fetch(url, options);
        }
        let { contacts, meta } = await response.json();
        while (meta.nextPageUrl) {
            let response = await fetch(meta.nextPageUrl, options);
            while (response.status === 429) {
                await setTimeout(1000)
                response = await fetch(url, options);
            }
            const { contacts: _contacts = [], meta: _meta = {} } = await response.json();
            contacts.push(..._contacts)
            meta = _meta
        }
        return contacts || []
    } catch (error) {
        console.error(error);
    }
}

const getOpportunities = async (token: { access_token: string; locationId: string; }) => {
    const contacts = await Contact.find()
    const opportunities: any[] = []
    const promises = contacts.map(async contact => {
        const url = `https://services.leadconnectorhq.com/opportunities/search?location_id=${token.locationId}&contact_id=${contact.contactId}`;
        const options = {
            method: 'GET',
            headers: { Authorization: `Bearer ${token.access_token}`, Version: '2021-07-28', Accept: 'application/json' }
        };

        try {
            await setTimeout(1000)
            let response = await fetch(url, options);
            while (response.status === 429) {
                await setTimeout(1000)
                response = await fetch(url, options);
            }
            const { opportunities: _opportunities = [] } = await response.json();
            if (!_opportunities.length) return
            opportunities.push(..._opportunities)
        } catch (error) {
            console.error(error);
        }
    })
    await Promise.all(promises)
    const existingOpportunities = await Opportunity.find()
    const formattedOpportunities = opportunities.map((opportunity: any) => {
        return { ...opportunity, opportunityId: opportunity.id }
    })
    const newOpportunities = formattedOpportunities.filter((o: any) => !existingOpportunities.find(opportunity => opportunity.opportunityId === o.opportunityId))
    await Opportunity.create(newOpportunities)
    existingOpportunities.forEach((opp: any) => {
        const newRecord = formattedOpportunities.find((o: any) => o.opportunityId === opp.opportunityId)
        if (newRecord) {
            opp.set(newRecord)
            opp.save()
        }
    })
}

const getConversations = async (token: { access_token: string; locationId: string; }) => {
    const contacts = await Contact.find()
    const conversationsData: any[] = []
    const promises = contacts.map(async contact => {
        const url = `https://services.leadconnectorhq.com/conversations/search?locationId=${token.locationId}&contactId=${contact.contactId}`;
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token.access_token}`,
                Version: '2021-04-15',
                Accept: 'application/json'
            }
        };

        try {
            await setTimeout(1000)
            let response = await fetch(url, options);
            while (response.status === 429) {
                await setTimeout(1000)
                response = await fetch(url, options);
            }
            const { conversations = [] } = await response.json();
            if (!conversations.length) return
            conversationsData.push(...conversations)
        } catch (error) {
            console.error(error);
        }
    })
    await Promise.all(promises)
    const existingConversations = await Conversation.find() || []
    const formattedConversations = conversationsData.map((conversation: any) => {
        return { ...conversation, conversationId: conversation.id }
    })
    const newConversations = formattedConversations.filter((c: any) => !existingConversations.find(conversation => conversation.conversationId === c.conversationId))
    await Conversation.create(newConversations)
    existingConversations.forEach((conv: any) => {
        const newRecord = formattedConversations.find((c: any) => c.conversationId === conv.conversationId)
        if (newRecord) {
            conv.set(newRecord)
            conv.save()
        }
    })
}

const getCalendars = async (token: { access_token: string; locationId: string; }) => {
    const url = `https://services.leadconnectorhq.com/calendars/?locationId=${token.locationId}`;
    const options = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token.access_token}`,
            Version: '2021-04-15',
            Accept: 'application/json'
        }
    };

    try {
        let response = await fetch(url, options);
        while (response.status === 429) {
            await setTimeout(1000)
            response = await fetch(url, options);
        }
        const { calendars = [] } = await response.json();
        const existingCalendars = await Calendar.find() || []
        const formattedCalendars = calendars.map((calendar: any) => {
            return { ...calendar, calendarId: calendar.id }
        })
        const newCalendars = formattedCalendars.filter((c: any) => !existingCalendars.find(calendar => calendar.calendarId === c.calendarId))
        await Calendar.create(newCalendars)
        existingCalendars.forEach((cal: any) => {
            const newRecord = formattedCalendars.find((c: any) => c.calendarId === cal.calendarId)
            if (newRecord) {
                cal.set(newRecord)
                cal.save()
            }
        })
    } catch (error) {
        console.error(error);
    }
    return await Calendar.find()
}

const getCalendarEvents = async (token: { access_token: string; locationId: string; }, calendars: any) => {
    const startTime = Date.now()
    const endTime = startTime + 1000 * 60 * 60 * 24 * 365
    let calendarEvents: any[] = []
    const promises = calendars.map(async (calendar: { calendarId: any; }) => {
        const url = `https://services.leadconnectorhq.com/calendars/events?locationId=${token.locationId}&calendarId=${calendar.calendarId}&startTime=${startTime}&endTime=${endTime}`;
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token.access_token}`,
                Version: '2021-04-15',
                Accept: 'application/json'
            }
        };

        try {
            await setTimeout(1000)
            let response = await fetch(url, options);
            while (response.status === 429) {
                await setTimeout(1000)
                response = await fetch(url, options);
            }
            let { events = [], meta = {} } = await response.json();
            if (meta?.nextPageUrl) {
                const response = await fetch(meta.nextPageUrl, options);
                const { events: _events = [] } = await response.json();
                events.push(..._events)
            }
            if (!events.length) return
            calendarEvents.push(...events)
        } catch (error) {
            console.error(error);
        }
    })

    await Promise.all(promises)

    const existingCalendarEvents = await CalendarEvent.find() || []
    const formattedCalendarEvents = calendarEvents.map((calendarEvent: any) => {
        return { ...calendarEvent, calendarEventId: calendarEvent.id }
    })
    const newCalendarEvents = formattedCalendarEvents.filter((c: any) => !existingCalendarEvents.find(calendarEvent => calendarEvent.calendarEventId === c.calendarEventId))
    await CalendarEvent.create(newCalendarEvents)
    existingCalendarEvents.forEach((cal: any) => {
        const newRecord = formattedCalendarEvents.find((c: any) => c.calendarEventId === cal.calendarEventId)
        if (newRecord) {
            cal.set(newRecord)
            cal.save()
        }
    })
}

const getProducts = async (token: { access_token: string; locationId: string; }) => {
    const url = `https://services.leadconnectorhq.com/products/?locationId=${token.locationId}`;
    const options = {
        method: 'GET',
        headers: { Authorization: `Bearer ${token.access_token}`, Version: '2021-07-28', Accept: 'application/json' }
    };

    try {
        let response = await fetch(url, options);
        while (response.status === 429) {
            await setTimeout(1000)
            response = await fetch(url, options);
        }
        const { products = [] } = await response.json();
        const existingProducts = await Product.find() || []
        const formattedProducts = products.map((product: any) => {
            return { ...product, productId: product._id }
        })
        const newProducts = formattedProducts.filter((p: any) => !existingProducts.find(product => product.productId === p.productId))
        await Product.create(newProducts)
        existingProducts.forEach((pro: any) => {
            const newRecord = formattedProducts.find((p: any) => p.productId === pro.productId)
            if (newRecord) {
                pro.set(newRecord)
                pro.save()
            }
        })
    } catch (error) {
        console.error(error);
    }
    const products = await Product.find() || []
    products.forEach(async (product) => {
        const url = `https://services.leadconnectorhq.com/products/${product.productId}/price?locationId=${token.locationId}`;
        const options = {
            method: 'GET',
            headers: { Authorization: `Bearer ${token.access_token}`, Version: '2021-07-28', Accept: 'application/json' }
        };

        try {
            await setTimeout(1000)
            let response = await fetch(url, options);
            while (response.status === 429) {
                await setTimeout(1000)
                response = await fetch(url, options);
            }
            const { prices = [] } = await response.json();
            product.set({ prices })
            await product.save();
        } catch (error) {
            console.error(error);
        }
    })
}

const getCampaigns = async (token: { access_token: string; locationId: string; }) => {
    const url = `https://services.leadconnectorhq.com/campaigns/?locationId=${token.locationId}`;
    const options = {
        method: 'GET',
        headers: { Authorization: `Bearer ${token.access_token}`, Version: '2021-07-28', Accept: 'application/json' }
    };

    try {
        let response = await fetch(url, options);
        while (response.status === 429) {
            await setTimeout(1000)
            response = await fetch(url, options);
        }
        const { campaigns = [] } = await response.json();
        const existingCampaigns = await Campaign.find() || []
        const formattedCampaigns = campaigns.map((campaign: any) => {
            return { ...campaign, campaignId: campaign._id }
        })
        const newCampaigns = formattedCampaigns.filter((c: any) => !existingCampaigns.find(campaign => campaign.campaignId === c.campaignId))
        await Campaign.create(newCampaigns)
        existingCampaigns.forEach((cam: any) => {
            const newRecord = formattedCampaigns.find((c: any) => c.campaignId === cam.campaignId)
            if (newRecord) {
                cam.set(newRecord)
                cam.save()
            }
        })
    } catch (error) {
        console.error(error);
    }
}

const getSubscriptions = async (token: { access_token: string; locationId: string; }) => {
    const url = `https://services.leadconnectorhq.com/payments/subscriptions?altId=${token.locationId}&altType=location`;
    const options = {
        method: 'GET',
        headers: { Authorization: `Bearer ${token.access_token}`, Version: '2021-07-28', Accept: 'application/json' }
    };

    try {
        let response = await fetch(url, options);
        while (response.status === 429) {
            await setTimeout(1000)
            response = await fetch(url, options);
        }
        const { data = [] } = await response.json();
        const existingSubscriptions = await Subscription.find() || []
        const formattedSubscriptions = data.map((subscription: any) => {
            return { ...subscription, subscriptionId: subscription._id }
        })
        const newSubscriptions = formattedSubscriptions.filter((s: any) => !existingSubscriptions.find(subscription => subscription.subscriptionId === s.subscriptionId))
        await Subscription.create(newSubscriptions)
        existingSubscriptions.forEach((sub: any) => {
            const newRecord = formattedSubscriptions.find((s: any) => s.subscriptionId === sub.subscriptionId)
            if (newRecord) {
                sub.set(newRecord)
                sub.save()
            }
        })
    } catch (error) {
        console.error(error);
    }
}

const getOrders = async (token: { access_token: string; locationId: string; }) => {
    const url = `https://services.leadconnectorhq.com/payments/orders?altId=${token.locationId}&altType=location`;
    const options = {
        method: 'GET',
        headers: { Authorization: `Bearer ${token.access_token}`, Version: '2021-07-28', Accept: 'application/json' }
    };

    try {
        let response = await fetch(url, options);
        while (response.status === 429) {
            await setTimeout(1000)
            response = await fetch(url, options);
        }
        const { data = [] } = await response.json();
        const existingOrders = await Order.find() || []
        const formattedOrders = data.map((order: any) => {
            return { ...order, orderId: order._id, altId: token.locationId }
        })
        const ordersWithItems: any[] = []
        const promises = await formattedOrders.map(async (order: any, index: number) => {
            const url = `https://services.leadconnectorhq.com/payments/orders/${order.orderId}?&altId=${token.locationId}&altType=location`;
            const options = {
                method: 'GET',
                headers: { Authorization: `Bearer ${token.access_token}`, Version: '2021-07-28', Accept: 'application/json' }
            };

            try {
                let response = await fetch(url, options);
                while (response.status === 429) {
                    await setTimeout(1000)
                    response = await fetch(url, options);
                }
                const { items = [] } = await response.json();
                order = { ...order, items }
                ordersWithItems.push(order)
            } catch (error) {
                console.error(error);
            }
        })
        await Promise.all(promises)
        const newOrders = ordersWithItems.filter((o: any) => !existingOrders.find(order => order.orderId === o.orderId))
        await Order.create(newOrders)
        existingOrders.forEach((ord: any) => {
            const newRecord = ordersWithItems.find((o: any) => o.orderId === ord.orderId)
            if (newRecord) {
                ord.set(newRecord)
                ord.save()
            }
        })
    } catch (error) {
        console.error(error);
    }
}