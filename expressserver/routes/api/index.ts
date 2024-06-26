import { db } from '../../utils/db'
import { Token } from '../../model/Token'
import express from 'express'
export const router = express.Router()

router.get("/api", (req: any, res: any) => {
    res.send("API")
})

router.route("/api/token/:id")
    .get(async (req: any, res: any) => {
        let existingRecord = await Token.findOne({ locationId: req.params.id })
        if (existingRecord) {
            res.status(200).json({ success: true, e: existingRecord })
            return
        }
        res.status(400).json({ success: false, e: "No token found" })
    })

router.route("/api/token")
    .post(async (req: any, res: any) => {
        if (!req.body?.token) {
            console.log(req.body)
            res.status(400).json({ message: "Missing body and/or token" })
        }
        let existingRecord = await Token.findOne({ locationId: req.body.token.locationId })
        if (existingRecord) {
            existingRecord.set({ ...req.body.token, tokenIssued: Date.now() })
            existingRecord!.save().then(e => {
                res.status(200).json({ success: true, e })
            }).catch(e => {
                res.status(400).json({ success: false, e })
            })
            return
        }
        const record = new Token({ ...req.body.token, tokenIssued: Date.now() })
        record.save().then(e => {
            res.status(200).json({ success: true, e })
        }).catch(e => {
            res.status(400).json({ success: false, e })
        })
    })