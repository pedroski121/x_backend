import mongoose from "mongoose";

interface IProductSchema {
    name:string,
    price:number,
    category:string,
    subCategory:string,
    specification:string,
    storeID:string,
    storeName:string,
    rating:number,
    quantity:number,
    size:string[],
    imgURLs?:string[], 
    imgAltText?:string,
    reviews?:{userID:string, review:string, date:string, time:string}[]
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
    size:{
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