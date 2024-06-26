import mongoose from 'mongoose'

let db : any

export const connectDb = async () => {
    db = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/family-view')
    if (db.error) {
        throw new Error('Database connection failed')
    }

    console.log('Database connected')
}

export { db }