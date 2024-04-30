import mongoose from "mongoose";
import { IOrder } from "../types/order";

const OrderSchema = new mongoose.Schema<IOrder>({
 userID:{
    type:String,
    required:true
 },
orderID:{
    type:String,
    required:true, 
    unique:true
},
productID:{
    type:String,
    required:true
},
pickUpStationID:{
    type:String,
    required:true
}, 
orderInitiationTime:{
    type:String, 
    required:true
},

quantity:{
    type:Number, 
    required:true
},
size:{
    type:String,
    required:false
},
currentStatus:{
    type:String,
    enum:["pending", "confirmed","shipped", "delivered"], 
    required:true
},
pendingDate:{
    required:true,
    type:String
},
amountPaid:{
    required:true, 
    type:Number,
},
confirmedDate:{
    required:false,
    type:String
}, 
shippedDate:{
    type:String,
    required:false
},
deliveredDate:{
    type:String,
    required:false
}

}, {collection:'orders', versionKey:false})

const Orders = mongoose.model('Orders',OrderSchema)

export {Orders}