import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import cookieSession from 'cookie-session';
import 'express-async-errors';
import 'dotenv/config';

import {signUpRouter} from './routes/auth/sign-up'
import { signInRouter } from "./routes/auth/sign-in";
import { getCurrentUser } from "./routes/auth/current-user";

import { getAllUsers } from "./routes/user/all-user";


import { addNewProduct } from "./routes/product/add-product";
import { getAllProducts } from "./routes/product/all-products";
import { findProduct } from "./routes/product/find-product";
import { updateProduct } from "./routes/product/update-product";
import { deleteProduct } from "./routes/product/delete-products";

import { addNewCategory } from "./routes/category/add-category";
import { getAllCategories } from "./routes/category/all-categories";
import { deleteCategory } from "./routes/category/delete-category";
import { deleteSubCategory } from "./routes/category/delete-subcategory";
import { updateCategory } from "./routes/category/update-category";
import { updateSubCategory } from "./routes/category/update-subcategory";
import { findCategory } from "./routes/category/find-category";

import { addNewSubCategory } from "./routes/sub-category/add-sub-category";
import { getAllSubCategories } from "./routes/sub-category/all-sub-categories";

import { BadRequestError } from "./errors/bad-request";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found";
import { queryProductsBasedOnCategory} from "./routes/product/query-products-based-on-category";
import { userCount } from "./routes/user/count-user";

const app = express();
app.use(cors({
    origin:process.env.ORIGIN,
    credentials:true
}))
const PORT:number = parseInt(`${process.env.PORT}`) || 5000;
app.use(express.json());
app.use(express.urlencoded({extended:true}));

if(PORT === 5000) {
    app.use(cookieSession({
        signed:false,
        secure: false,
    }))
} else {
    app.set('trust proxy', 1); // trust first proxy
    app.use(cookieSession({
        secure:true,
    }))
}

app.use(signUpRouter);
app.use(signInRouter);
app.use(getCurrentUser);

app.use(getAllUsers);
app.use(userCount);

app.use(addNewProduct);
app.use(getAllProducts);
app.use(findProduct);
app.use(updateProduct);
app.use(deleteProduct);
 
app.use(addNewCategory);
app.use(getAllCategories);
app.use(deleteCategory);
app.use(deleteSubCategory);
app.use(updateCategory);
app.use(updateSubCategory);
app.use(findCategory);
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


