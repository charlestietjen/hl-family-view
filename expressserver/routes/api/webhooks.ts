import express from 'express'
export const webhooks = express.Router()

webhooks.route("/contactcreate").post(async (req: any, res: any) => {
    console.log(req.body)
    res.status(200).json({ message: "OK" })
})
.get(async (req: any, res: any) => {
    res.status(200).json({ message: "OK" })
})

webhooks.route("/").post(async (req: any, res: any) => {
    console.log(req.body)
    res.status(200).json({ message: "OK" })
})