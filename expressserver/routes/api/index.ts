import { Token, Contact, Family, Calendar, CalendarEvent, Campaign, Conversation, Opportunity, Product, Transaction, Order, Subscription } from '../../model'
import express from 'express'
import { initializeDb } from '../../utils/highlevel'
import { webhooks } from './webhooks'
import { stripe } from '../../main'
import { cancelSubscription, findSubscriptionByOrderId, pauseSubscription, resumeSubscription } from '../../utils/stripe'
export const router = express.Router()

router.get("/", (req: any, res: any) => {
    res.send("API")
})

router.route("/token/:id")
    .get(async (req: any, res: any) => {
        let existingRecord = await Token.findOne({ locationId: req.params.id })
        if (existingRecord) {
            res.status(200).json({ data: existingRecord })
            return
        }
        res.status(400).json({ message: "No token found" })
    })
    .put(async (req: any, res: any) => {
        let existingRecord = await Token.findOne({ locationId: req.params.id })
        if (existingRecord) {
            existingRecord.set({ ...req.body.token, tokenIssued: Date.now() })
            existingRecord!.save().then(rec => {
                res.status(200).json({ rec })
            }).catch(e => {
                res.status(400).json({ e })
            })
            return
        }
    })

router.route("/token")
    .get(async (req: any, res: any) => {
        const records = await Token.find()
        res.status(200).json({ data: records[0] })
    })
    .post(async (req: any, res: any) => {
        if (!req.body) {
            res.status(400).json({ message: "Missing body and/or token" })
            return
        }
        let existingRecord = await Token.findOne({ locationId: req.body.locationId })
        if (existingRecord) {
            existingRecord.set({ ...req.body.token, tokenIssued: Date.now() })
            existingRecord!.save().then(rec => {
                res.status(200).json({ rec })
            }).catch(e => {
                res.status(400).json({ e })
            })
            return
        }
        const record = new Token({ ...req.body, tokenIssued: Date.now() })
        record.save().then(rec => {
            initializeDb(req.body)
            res.status(200).json({ rec })
        }).catch(e => {
            res.status(400).json({ e })
        })
    })

router.route("/contacts/:id")
    .get(async (req: any, res: any) => {
        let existingRecord = await Contact.findOne({ contactId: req.params.id }).populate('orders')
        if (existingRecord) {
            res.status(200).json({ data: existingRecord })
            return
        }
        res.status(400).json({ message: "No contact found" })
    })

router.route("/contacts")
    .get(async (req: any, res: any) => {
        try {
            const records = await Contact.find().populate('orders')
            res.status(200).json({ data: records })
        } catch (e) {
            res.status(400).json({ e })
        }
    })

router.route("/families")
    .get(async (req: any, res: any) => {
        try {
            const records = await Family.find().populate(
                {
                    path: 'contacts',
                    populate: [
                        { path: 'transactions' },
                        { path: 'orders' },
                        { path: 'calendarEvents' },
                        { path: 'conversations' },
                        { path: 'opportunities' },
                        { path: 'subscriptions' },
                    ]
                })
            res.status(200).json({ data: records })
        } catch (e) {
            res.status(400).json({ e })
        }
    })

router.route("/family/:id")
    .get(async (req: any, res: any) => {
        let existingRecord = await Family.findOne({ _id: req.params.id }).populate(
            {
                path: 'contacts',
                populate: [
                    { path: 'transactions' },
                    { path: 'orders' },
                    { path: 'calendarEvents' },
                    { path: 'conversations' },
                    { path: 'opportunities' },
                    { path: 'subscriptions' },
                ]
            })
        if (existingRecord) {
            res.status(200).json({ data: existingRecord })
            return
        }
        res.status(400).json({ message: "No family found" })
    })

router.route("/intializeDb").post(async (req: any, res: any) => {
    const { token } = req.body
    const data = await initializeDb(token)
    if (data) {
        res.status(200).json({ data })
        return
    }
    res.status(400).json({ data })
})

router.route("/subscription")
    // pause route
    .put(async (req: any, res: any) => {
        if (!req.body?.id || req.body?.pauseStatus !== 'pause' && req.body?.pauseStatus !== 'resume') {
            res.status(400).json({ message: "Missing/invalid body and/or token" })
            return
        }
        try {
            if (!stripe) throw "Stripe not initialized"
            let existingRecord = await Subscription.findOne({ subscriptionId: req.body.id })
            const stripeSubscription = await findSubscriptionByOrderId(stripe, req.body.id)
            if (!stripeSubscription) throw "Subscription not found"
            const stripeResponse = req.body.pauseStatus === 'pause' ? await pauseSubscription(stripe, stripeSubscription.id) : await resumeSubscription(stripe, stripeSubscription.id)
            if (!stripeResponse) throw "Failed to update subscription status, is the subscription still active?"
            res.json(stripeResponse)
        } catch (e) {
            res.status(400).json({ e })
        }
    })
    // cancel route
    .delete(async (req: any, res: any) => {
        if (!req.body?.id) {
            res.status(400).json({ message: "Missing/invalid body and/or token" })
            return
        }
        try {
            if (!stripe) throw "Stripe not initialized"
            let existingRecord = await Subscription.findOne({ subscriptionId: req.body.id })
            const stripeSubscription = await findSubscriptionByOrderId(stripe, req.body.id)
            if (!stripeSubscription) throw "Subscription not found"
            const stripeResponse = await cancelSubscription(stripe, stripeSubscription.id)
            if (!stripeResponse) throw "Failed to update subscription status, is the subscription still active?"
            res.json(stripeResponse)
        } catch (e) {
            res.status(400).json({ e })
        }
    })

router.use("/webhooks", webhooks)