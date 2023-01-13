import express, { Request, Response } from "express";
import mongoose from "mongoose";
import 'dotenv/config'
const app = express();


const start = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error('URI not found')
        }
        
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to mongodb  database')
        app.listen(3000, ()=>{
            console.log('Listening on port 3000')
        })
        
    } catch (error) {
        console.log(error)
    }
}
start()


