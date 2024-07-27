import { Request, Response } from "express";
import { validationResult} from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { Orders } from "../models/order-model";
import { Product } from "../models/product-model";
import { ServerError } from "../errors/server-error";
import { BadRequestError } from "../errors/bad-request";
import { IOrder } from "../types/order";

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

export const getOrder = async (req:Request, res:Response) => {
    const orderID = req.params.id;
    const order = await Orders.findOne({orderID})
    .catch((err)=>{
        throw new BadRequestError("Order not fetched")
    });
    
    res.status(200).json(order);
}

export const getOrdersCount= async (req:Request, res:Response) => {
    const orderCount = await Orders.countDocuments({})
    .catch((err)=>{
        const error =  new ServerError("Order count could not be fetched")
        console.log(err)
        res.status(500).json({message:error.message, success:false})
    });
    res.status(200).json({orderCount})
}

// controller to find the number of products in a order with a specific status
export const getNumberOfOrdersOnCurrentStatus = async (req:Request, res:Response) =>{
    const status = req.params.status
    const count =await Orders.countDocuments({"productDetails.currentStatus":status})
    .catch((err)=>{
        const error =  new ServerError("Order status count could not be fetched")
        console.log(err)
        res.status(500).json({message:error.message, success:false})
    });
    res.status(200).json({status,count})
}


export const getUserOrders = async (req:Request, res:Response) =>{
    if(req.currentUser){
        const {_id} = req.currentUser 
        if(_id){ 
            const ordersList = await Orders.find({userID:_id}).sort({orderID:-1})
            .catch(()=>{
                throw new ServerError('Error fetching users')
            })
            res.status(200).send(ordersList) 
        }
        else {
            throw new BadRequestError('Not Authorized')
        } 
    }
    else {
        throw new BadRequestError('Not Authorized')
    }  
}

export const addNewOrder = async (req:Request, res:Response) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let errorsArray = errors.array()
        throw new RequestValidationError(errorsArray);
    }
    let {userID, productDetails, pickUpStationID,orderInitiationTime,createdAt, totalAmountPaid, referenceID}:IOrder = req.body;
    
    const numOfOrders = await Orders.countDocuments()
    const orderID = `${numOfOrders + 1}`
    
    const order = {
        userID,
        orderID,
        productDetails,
        pickUpStationID,
        orderInitiationTime,
        createdAt,
        totalAmountPaid, 
        status:"pending",
        referenceID
    }
    const newOrder = new Orders(order);
    productDetails.map(async (details:any)=>{
        let quantity = details.quantity
        await Product.findByIdAndUpdate(details.productID, { $inc: { 'quantity': -quantity } }, 
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
    const {currentStatus, date, orderID, productID} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
       throw new RequestValidationError(errors.array())
    }
  
     if(currentStatus === "confirmed"){
        await Orders.findOneAndUpdate({orderID, "productDetails.productID":productID},
        {"$set":{"productDetails.$.currentStatus":currentStatus, "productDetails.$.confirmedDate":date}})
        .then(()=>{
            res.status(201).json({message:`Order ${orderID} updated - ${currentStatus}`, success:true})
        })
        .catch((err)=>{
            const serverError = new ServerError("Error updating order")
            console.error(err)
            res.status(500).json({success:false, message:serverError.message})
        })
    } else if(currentStatus === "shipped"){
        await Orders.findOneAndUpdate({orderID, "productDetails.productID":productID},
        {"$set":{"productDetails.$.currentStatus":currentStatus, "productDetails.$.shippedDate":date}})
        .then(()=>{
            res.status(201).json({message:`Order ${orderID} updated - ${currentStatus}`, success:true})
        })
        .catch((err)=>{
            const serverError = new ServerError("Error updating order")
            console.error(err)
            res.status(500).json({success:false, message:serverError.message})
        })
    } else {
        await Orders.findOneAndUpdate({orderID, "productDetails.productID":productID},
        {"$set":{"productDetails.$.currentStatus":currentStatus, "productDetails.$.deliveredDate":date, status:'completed'}})
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