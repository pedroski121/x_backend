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
    let {userID, productID, pickUpStationID,orderInitiationTime, quantity, size, pendingDate, amountPaid} = req.body;
    orderInitiationTime =  orderInitiationTime.split("").reverse().join("")
    const numOfOrders = await Orders.countDocuments()
    const orderID = `SLU-${numOfOrders + 1}-${orderInitiationTime}`
    const currentStatus = "pending"
    if(!size){
        size = ''
    }
    const order = {
        userID,
        orderID,
        productID,
        pickUpStationID,
        orderInitiationTime, 
        quantity,
        size, 
        currentStatus, 
        pendingDate, 
        amountPaid
    }
    const newOrder = new Orders(order);
    const previousProductQuantity = await Product.findById(productID)
    .then((product)=>{
       if(product){
            return product.quantity
       }
    })    
    newOrder.save(async (err)=>{
        if(err){ 
            const error = new ServerError("Order not saved to database")
            console.log(error)
            res.status(500).json({success:false, message:error.message})
        } else {
            previousProductQuantity && await Product.findByIdAndUpdate(productID, {quantity:previousProductQuantity-quantity})
            .catch((err)=>{
                console.error(err)
            })  
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