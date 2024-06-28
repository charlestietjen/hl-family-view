import { Token, Contact, Family } from '../../model'
import express from 'express'
import { initializeDb } from '../../utils/highlevel'
export const router = express.Router()

router.get("/api", (req: any, res: any) => {
    res.send("API")
})

router.route("/api/token/:id")
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

router.route("/api/token")
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

router.route("/api/contacts/:id")
    .get(async (req: any, res: any) => {
        let existingRecord = await Contact.findOne({ contactId: req.params.id }).populate('orders')
        if (existingRecord) {
            res.status(200).json({ data: existingRecord })
            return
        }
        res.status(400).json({ message: "No contact found" })
    })

router.route("/api/contacts")
    .get(async (req: any, res: any) => {
        try {
            const records = await Contact.find().populate('orders')
            res.status(200).json({ data: records })
        } catch (e) {
            res.status(400).json({ e })
        }
    })

    router.route("/api/families")
    .get(async (req: any, res: any) => {
        try {
            const records = await Family.find().populate('contacts')
            res.status(200).json({ data: records })
        } catch (e) {
            res.status(400).json({ e })
        }
    })

    router.route("/api/family/:id")
    .get(async (req: any, res: any) => {
        let existingRecord = await Family.findOne({ _id: req.params.id }).populate('contacts')
        if (existingRecord) {
            res.status(200).json({ data: existingRecord })
            return
        }
        res.status(400).json({ message: "No family found" })
    })

router.route("/api/intializeDb").post(async (req: any, res: any) => {
    const { token } = req.body
    const data = await initializeDb(token)
    if (data) {
        res.status(200).json({ data })
        return
    }
    res.status(400).json({ data })
})