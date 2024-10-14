import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import cookieSession from 'cookie-session';
import 'express-async-errors'
import 'dotenv/config'


import { BadRequestError } from "./errors/bad-request";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found";

import { authRoutes } from "./routes/authRoute";
import { categoryRoutes } from "./routes/categoryRoute";
import { subCategoryRoutes } from "./routes/subCategoryRoute"; 
import { productRoutes } from "./routes/productRoute";
import { userRoutes } from "./routes/userRoutes";
import { wishListRoutes } from "./routes/wishListRoute";
import { bagRoutes } from "./routes/bagRoute";
import { logisticsCompanyLocationRoutes } from "./routes/logisticsCompanyLocationRoute";
import { orderRoutes } from "./routes/orderRoute";
import { search } from "./services/search";
import { clerkMiddleware } from "@clerk/express";
const app = express();
app.use(cors({
    origin:[`${process.env.PROD_ORIGIN}`, `${process.env.DEV_ORIGIN}`],
    credentials:true,     
}))
const PORT:number = parseInt(`${process.env.PORT}`) || 5000
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(clerkMiddleware())
app.set('trust proxy', 1); // trust first proxy

 
if(PORT === 5000) {
    app.use(cookieSession({
        keys:[`${process.env.COOKIE_SECRET}`], 
        secure:false
    }))
} else {
    app.use(cookieSession({
        keys:[`${process.env.COOKIE_SECRET}`],
        secure:true,
        sameSite:'none', 
        domain:process.env.DOMAIN || '',
        httpOnly:true,
    }))
}


app.use(authRoutes)
app.use(categoryRoutes)
app.use(productRoutes)
app.use(userRoutes)
app.use(wishListRoutes)
app.use(subCategoryRoutes)
app.use(bagRoutes)
app.use(logisticsCompanyLocationRoutes)
app.use(orderRoutes)

app.use(search)


app.all('*', async () =>{
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
         
    } 
    catch (error) {
        console.log(error)
        console.log('could not start up server')
    } 
}
start()


