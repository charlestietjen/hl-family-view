import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import { router as apiRouter } from './routes/api/index'
import { connectDb } from './utils/db'
import { timedAuthRefresh, timedCampRefresh, timedActiveRegistrationsRefresh, timedRefreshDb } from './utils/scheduled'
import { refreshToken } from './utils/ucportal'
import { initStripe } from './utils/stripe'
import Stripe from 'stripe'
import { startupDatabaseSync } from './utils/init'

export let stripe : Stripe | null = null

dotenv.config()

async function main() {
    const app = express()
    const port = process.env.PORT || 3000
    stripe = await initStripe()

    connectDb()
    refreshToken()
    timedAuthRefresh()
    // pre-webhook db update method
    // timedDbReinitialize()
    timedRefreshDb()
    timedActiveRegistrationsRefresh()
    timedCampRefresh()
    // operation is too expensive with 60k contacts present
    // startupDatabaseSync()

    app.use(express.json())
    app.use(express.static(path.join(__dirname, 'public')))
    app.use("/api", apiRouter)

    app.get('/*', (_req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

main()