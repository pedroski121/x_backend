import mongoose from "mongoose";
import { TBag } from "../types/bag";


const BagSchema = new mongoose.Schema<TBag>({
    productID:{
        required:true,
        type:String
    },
    quantity:{
        required:true,
        type:Number
    }, 
    size:{
        required:true, 
        type:String
    }, 
    userID:{
        required:true, 
        type:String
    }

}, {collection:'bag', versionKey:false})

const Bag = mongoose.model('Bag',BagSchema)

export {Bag}