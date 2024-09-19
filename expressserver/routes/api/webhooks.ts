import express from 'express'
import { Contact, Family } from '../../model'
export const webhooks = express.Router()

webhooks.route("/").post(async (req: any, res: any) => {
    try {
        switch (req.body.type) {
            case "ContactCreate":
                if (!req.body.companyName) {
                    req.body.familyName = `${req.body.lastNameRaw} Family`
                } else {
                    req.body.familyName = req.body.companyName
                }
                req.body.contactId = req.body.id
                req.body.customFields?.forEach((field: { value: String | null }) => {
                    if (typeof field.value === 'string') {
                        if (field.value === 'Parent' || field.value === 'Student') {
                            req.body.contactType = field.value
                        }
                    }
                })
                const contact = await Contact.create(req.body)
                const family = await Family.findOne({ familyName: req.body.familyName })
                if (!family) {
                    await Family.create({ familyName: req.body.familyName })
                }
                break
            case "ContactUpdate":
                const existingContact = await Contact.findOne({ contactId: req.body.id })
                if (!req.body.companyName) {
                    req.body.familyName = `${req.body.lastNameRaw} Family`
                } else {
                    req.body.familyName = req.body.companyName
                }
                req.body.contactId = req.body.id
                req.body.customFields?.forEach((field: { value: String | null }) => {
                    if (typeof field.value === 'string') {
                        if (field.value === 'Parent' || field.value === 'Student') {
                            req.body.contactType = field.value
                        }
                    }
                })
                const existingFamily = await Family.findOne({ familyName: req.body.familyName })
                if (!existingFamily) {
                    await Family.create({ familyName: req.body.familyName })
                } else if (existingFamily.familyName !== req.body.familyName) {
                    existingFamily.set({ familyName: req.body.familyName })
                    await existingFamily.save()
                }
                if (!existingContact) {
                    const contact = await Contact.create(req.body)
                    break
                }
                existingContact.set(req.body)
                await existingContact.save()
                break
            case "ContactDelete":
                await Contact.findOneAndDelete({ contactId: req.body.id })
                break
            default:
                break
        }
    } catch (error) {
        console.error(error)
    }
    res.status(200).json({ message: "OK" })
})