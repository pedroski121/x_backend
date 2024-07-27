import mongoose from "mongoose";
import { TProduct } from "../types/product";


const ProductSchema = new mongoose.Schema<TProduct>({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        enum: ["men","women","children","okirika","unisex"],
        required:true
    },
    subCategory:{
        type:String,
        required:true 
    },
    specification:{
        type:String,
        required:true
    },
    sizes:{
        type:[String],
        required:true
    },
    quantity: {
        type:Number,
        required:true
    },
    storeID:{
        type:String,
        required:true
    },
    storeName:{
        type:String,
        required:true
    },
    storePhoneNumber:{
        type:Number,
        required:true
    },
    rating:{
        type:Number
    },
    imgURLs:[String],
    imgAltText:String,
    reviews:[{
             userID:String,
             review:String, 
             date:String,
             time:String
        }],
},{versionKey:false});

const Product = mongoose.model("Product", ProductSchema);


export {Product}