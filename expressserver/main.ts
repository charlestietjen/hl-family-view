import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import { router as apiRouter } from './routes/api/index'
import { connectDb, db } from './utils/db'
import { timedAuthRefresh, timedDbReinitialize, timedCampRefresh, timedActiveRegistrationsRefresh } from './utils/scheduled'
import { refreshToken } from './utils/ucportal'
import { initStripe, getSubscriptions } from './utils/stripe'
import Stripe from 'stripe'

dotenv.config()
const app = express()
const port = process.env.PORT || 3000
const stripe = initStripe()

connectDb()
refreshToken()
timedAuthRefresh()
// pre-webhook db update method
timedDbReinitialize()

timedActiveRegistrationsRefresh()
timedCampRefresh()


app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use("/api", apiRouter)

app.get('/*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})