import { Token, Contact, Family, Calendar, CalendarEvent, Campaign, Conversation, Opportunity, Product, Transaction, Order } from '../../model'
import express from 'express'
import { initializeDb } from '../../utils/highlevel'
import { webhooks } from './webhooks'
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
        // console.log(req.body)
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

router.route("/calendars")
    .get(async (req: any, res: any) => {
        const records = await Calendar.find()
        res.status(200).json({ data: records })
    })

router.route("/calendarevents/")
    .get(async (req: any, res: any) => {
        const records = await CalendarEvent.find()
        res.status(200).json({ data: records })
    })

router.route("/campaigns")
    .get(async (req: any, res: any) => {
        const records = await Campaign.find()
        res.status(200).json({ data: records })
    })

router.route("/conversations")
    .get(async (req: any, res: any) => {
        const records = await Conversation.find()
        res.status(200).json({ data: records })
    })

router.route("/opportunities")
    .get(async (req: any, res: any) => {
        const records = await Opportunity.find()
        res.status(200).json({ data: records })
    })

router.route("/orders")
    .get(async (req: any, res: any) => {
        const records = await Order.find()
        res.status(200).json({ data: records })
    })

router.route("/products")
    .get(async (req: any, res: any) => {
        const records = await Product.find()
        res.status(200).json({ data: records })
    })

router.route("/transactions")
    .get(async (req: any, res: any) => {
        const records = await Transaction.find()
        res.status(200).json({ data: records })
    })

router.use("/webhooks", webhooks)