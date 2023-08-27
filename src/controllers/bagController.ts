import {Request, Response} from 'express'
import { Bag } from '../models/bag-model'
import { ServerError } from '../errors/server-error'
import { BadRequestError } from '../errors/bad-request'
import { TBag, BagBody } from '../types/bag'
import { Product } from '../models/product-model'

import { RequestValidationError } from '../errors/request-validation-error'
import { validationResult } from 'express-validator'

// get baglist
export const getBagList = async (req:Request, res:Response) => {
    if(req.currentUser){
        const {_id} = req.currentUser 
        if(_id){ 
            const bagList = await Bag.find({userID:_id}).catch(()=>{
                throw new ServerError('Error fetching baglist')
            })
            res.status(200).send(bagList) 
        }
        else {
            throw new BadRequestError('Not Authorized')
        } 
    }
    else {
        throw new BadRequestError('Not Authorized')
    }    
}
 
// add new baglist
export const addNewbagItem = async (req:BagBody<TBag>, res:Response) => {
    const errors = validationResult(req); 
    if(!errors.isEmpty()){
        let errorsArray = errors.array()
        throw new RequestValidationError(errorsArray);
    }
    const bag= req.body;
    const userID = req.currentUser?._id
    if(req.currentUser) {
            const bagExist:TBag[] =  await Bag.find({productID:bag.productID, userID})

            const productExist = await Product.find({_id:bag.productID})
            .then((productItem)=>{
                if(productItem[0].quantity < bag.quantity){
                    throw new BadRequestError('Quantity too much')
                }
                return productItem  
            }).catch(()=>{
                throw new ServerError('Server error')
            })
     
            if(!bagExist.length && !!productExist){
                const baglist = new Bag({...bag, userID});
               let item =  await baglist.save()
               .then((response)=>{
                let responseObj = response.toObject()
                delete responseObj.userID  
                return responseObj
               })
               .catch(()=>{
                    throw new BadRequestError('Error saving bag item')
                })
                         
                res.status(200).json(item)
            }
            else {
                throw new BadRequestError('item already in bag')
            } 
    } else{
        throw new BadRequestError('Not authorized')
    }
}

// delete bag item
export const deleteBagItem = async (req:Request, res:Response) => {
    const {...bag} = req.body
    if(req.currentUser){
        await Bag.findOneAndDelete({userID:req.currentUser._id,_id:bag._id})
        .then((bag)=>{
            if(!bag) {
                res.status(404).json([{message:"bag item doesn't exist", success:false}])
            } else {
                res.status(200).json([{message:'bag item removed', success:true}])
            }
        })
        .catch(()=>{
            throw new ServerError('Bag item not deleted')
        })
    }
    else {
        
        throw new BadRequestError('Not Authorized')

    }
}

export const emptyBag = async (req:Request, res:Response) =>{
    if(req.currentUser){
        await Bag.deleteMany({userID:req.currentUser._id})
        .then((bag)=>{
            if(bag.deletedCount === 0) {
                res.status(404).json([{message:"bag already empty", success:false}])
            } else {
                res.status(200).json([{message:'all items in bag removed', success:true}])
            }
        })
        .catch(()=>{
            throw new ServerError('Error deleting bag')
        })
    }
    else {
        
        throw new BadRequestError('Not Authorized')

    }
}