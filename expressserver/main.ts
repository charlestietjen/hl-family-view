import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import { router } from './routes/api/index'
import { connectDb, db } from './utils/db'

dotenv.config()
const app = express()
const port = process.env.PORT || 3000

connectDb()

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(router)

app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})