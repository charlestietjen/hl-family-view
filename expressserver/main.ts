import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import { router } from './routes/api/index'
import { connectDb, db } from './utils/db'
import { timedAuthRefresh, timedDbReinitialize } from './utils/scheduled'
// import { initStripe } from './utils/stripe'

dotenv.config()
const app = express()
const port = process.env.PORT || 3000

connectDb()
timedAuthRefresh()
// pre-webhook db update method
timedDbReinitialize()

// successful stripe integration test
// initStripe().then((res: any) => console.log(res))

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(router)

app.get('/*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})