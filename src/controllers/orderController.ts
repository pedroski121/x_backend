import { Request, Response } from "express";
import { validationResult} from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { Orders } from "../models/order-model";
import { Product } from "../models/product-model";
import { ServerError } from "../errors/server-error";

export const getAllOrders = async (req:Request, res:Response) => {
    const {page = 1, limit=30} = req.query
    const allOrders = await Orders.find({})
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .catch(()=>{
        throw new ServerError("Users could not be fetched")
    });
    
    res.status(200).json(allOrders)
}

export const addNewOrder = async (req:Request, res:Response) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let errorsArray = errors.array()
        throw new RequestValidationError(errorsArray);
    }
    let {userID, productIDAndQuantity, pickUpStationID,orderInitiationTime, pendingDate, totalAmountPaid} = req.body;
    orderInitiationTime =  orderInitiationTime.split("").reverse().join("")
    const numOfOrders = await Orders.countDocuments()
    const orderID = `SLU-${numOfOrders + 1}-${orderInitiationTime}`
    const currentStatus = "pending"
  
    const order = {
        userID,
        orderID,
        productIDAndQuantity,
        pickUpStationID,
        orderInitiationTime, 
        currentStatus, 
        pendingDate, 
        totalAmountPaid
    }
    const newOrder = new Orders(order);
    productIDAndQuantity.map(async (idAndQuantity:any)=>{
        let quantity = idAndQuantity.quantity
        await Product.findByIdAndUpdate(idAndQuantity.productID, { $inc: { 'quantity': -quantity } }, 
        { new: true },)
        .catch((err)=>{
        const serverError = new ServerError('Error when updating product quantity')
      console.log(serverError.message)
      console.error(err)}) 
    })
    newOrder.save(async (err)=>{
        if(err){ 
            const error = new ServerError("Order not saved to database")
            console.log(error.message)
            console.log(err)
            res.status(500).json({success:false, message:error.message})
        } else {
        
            res.status(201).json({success:true, message:"saved successfully"})
        }
    })
}

export const updateOrder = async (req:Request, res:Response) => {
    const {currentStatus, confirmedDate, shippedDate, deliveredDate, orderID} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
       throw new RequestValidationError(errors.array())
    }
  
     if(currentStatus === "confirmed"){
        await Orders.findOneAndUpdate({orderID}, {currentStatus, confirmedDate})
        .then(()=>{
            res.status(201).json({message:`Order ${orderID} updated - ${currentStatus}`, success:true})
        })
        .catch((err)=>{
            const serverError = new ServerError("Error updating order")
            console.error(err)
            res.status(500).json({success:false, message:serverError.message})
        })
    } else if(currentStatus === "shipped"){
        await Orders.findOneAndUpdate({orderID}, {currentStatus, shippedDate})
        .then(()=>{
            res.status(201).json({message:`Order ${orderID} updated - ${currentStatus}`, success:true})
        })
        .catch((err)=>{
            const serverError = new ServerError("Error updating order")
            console.error(err)
            res.status(500).json({success:false, message:serverError.message})
        })
    } else {
        await Orders.findOneAndUpdate({orderID}, {currentStatus, deliveredDate})
        .then(()=>{
            res.status(201).json({message:`Order ${orderID} updated - ${currentStatus}`, success:true})
        })
        .catch((err)=>{
            const serverError = new ServerError("Error updating order")
            console.error(err)
            res.status(500).json({success:false, message:serverError.message})
        })
    }
}

export const deleteOrder = async (req:Request, res:Response) => {
    const {orderID} = req.body;
    await Orders.findOneAndDelete({orderID}).then(()=>{
        res.status(200).json({message:`Order ${orderID} deleted`, success:true})
    })
    .catch((err)=>{
        const serverError = new ServerError("Error deleting order")
        console.error(err)
        res.status(500).json({success:false, message:serverError.message})
    })

}