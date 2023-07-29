import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import cookieSession from 'cookie-session';
import 'express-async-errors'
import 'dotenv/config'

import { getAllUsers } from "./routes/user/all-user";

import { addNewSubCategory } from "./routes/sub-category/add-sub-category";
import { getAllSubCategories } from "./routes/sub-category/all-sub-categories";

import { BadRequestError } from "./errors/bad-request";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found";
import { queryProductsBasedOnCategory} from "./routes/product/query-products-based-on-category";
import { userCount } from "./routes/user/count-user";

import { authRoutes } from "./routes/authRoute";
import { categoryRoutes } from "./routes/categoryRoute";
import { productRoutes } from "./routes/productRoute";
const app = express();
app.use(cors({
    origin:process.env.ORIGIN,
    credentials:true,     
}))
const PORT:number = parseInt(`${process.env.PORT}`) || 5000
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('trust proxy', 1); // trust first proxy
    app.use(cookieSession({
        keys:[`${process.env.COOKIE_SECRET}`], 
        secure:false
    }))
// if(PORT === 5000) {

// } else {
//     app.use(cookieSession({
//         keys:[`${process.env.COOKIE_SECRET}`],
//         secure:true,
//         sameSite:'none', 
//         // domain:process.env.DOMAIN || '',
//         // path:'/',
//         // httpOnly:true
//         maxAge: 1000 * 60 * 60
//     }))
// }


app.use(authRoutes)
app.use(categoryRoutes)
app.use(productRoutes)

app.use(getAllUsers);
app.use(userCount);


app.use(queryProductsBasedOnCategory);

app.use(addNewSubCategory)
app.use(getAllSubCategories)

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
        
    } 
    catch (error) {
        console.log('could not start up server')
    } 
}
start()


