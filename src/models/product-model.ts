import mongoose from "mongoose";

interface IProductSchema {
    name:string,
    price:number,
    category:string,
    subCategory:string,
    specification:string,
    storeID:string,
    storeName:string,
    quantity:number,
    imgURLs?:string[],
    reviews?:{userID:string, review:string, date:string}[]
}

const ProductSchema = new mongoose.Schema<IProductSchema>({
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
        enum: ["men","women","children","okrika","unisex"],
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
    imgURLs:[String],
    reviews:[{
             userID:String,
             review:String, 
             date:String
        }],
},{versionKey:false});

const Product = mongoose.model("Product", ProductSchema);


export {Product}