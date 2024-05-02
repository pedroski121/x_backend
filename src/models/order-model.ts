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
productDetails: [{
    productID: { type: String, required: true },
    quantity: { type: Number, required: true },
    size:{type:String, required:false}, 
    amountPaid:{type:Number, required:true},
    currentStatus:{
        type:String,
        enum:["pending", "confirmed","shipped", "delivered"], 
        required:true
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
    },
    pendingDate:{
        required:true,
        type:String
    },
  }],
pickUpStationID:{
    type:String,
    required:true
}, 
orderInitiationTime:{
    type:String, 
    required:true
},




referenceID:{
    type:String,
    required:false
},

totalAmountPaid:{
    required:true, 
    type:Number,
},


}, {collection:'orders', versionKey:false})

const Orders = mongoose.model('Orders',OrderSchema)

export {Orders}