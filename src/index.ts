import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import cookieSession from 'cookie-session';
import 'express-async-errors'
import 'dotenv/config'

import {signUpRouter} from './routes/auth/sign-up'
import { signInRouter } from "./routes/auth/sign-in";
import { getCurrentUser } from "./routes/auth/current-user";
import { BadRequestError } from "./errors/bad-request";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found";

const app = express();
const PORT:number = parseInt(`${process.env.PORT}`) || 5000
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:process.env.ORIGIN,
    credentials:true
}))
app.set('trust proxy', 1); // trust first proxy
app.use(cookieSession({
    signed:false
}))

app.use(signUpRouter);
app.use(signInRouter);
app.use(getCurrentUser);
app.get('/testing-prod', (req,res)=>{
    res.send("Website works")
})
app.all('*', async (req,res) =>{
    throw new NotFoundError()
})
app.use(errorHandler);



const start = async () => {
    if (!process.env.MONGO_URI) {
        throw new BadRequestError('No Mongo URI in environment')
        }
        
    try {
        mongoose.set('strictQuery',true)
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to mongodb  database')
        app.listen(PORT, ()=>{
            console.log(`Listening on port ${PORT}`) 
        })
        
    } catch (error) {
        console.log('could not start up server')
    }
}
start()


