import {Request, Response} from 'express'
import { WishList } from '../models/wishlist-model'
import { ServerError } from '../errors/server-error'
import { BadRequestError } from '../errors/bad-request'
import { IWishList } from '../types/wishlist'


// get wishlist
export const getWishList = async (req:Request, res:Response) => {
    const userID = req.params.userID
    if(req.currentUser){
        const {_id} = req.currentUser 
        if(userID === _id){ 
            const wishList = await WishList.find({userID}).catch(()=>{
                throw new ServerError('Error fetching wishlist')
            })
            res.status(200).send(wishList) 
        }
        else {
            throw new BadRequestError('Not Authorized')
        } 
    }
    else {
        throw new BadRequestError('Not Authorized')
    }    
}

// add new wishlist
export const addNewWishItem = async (req:Request, res:Response) => {
    const {...wish} = req.body;
    if(req.currentUser) {
        const {_id} = req.currentUser
        if(wish.userID === _id ) { 
            const wishlist = new WishList(wish);
            const wishExist:IWishList[] =  await WishList.find({productID:wish.productID, userID:wish.userID})
            if(!wishExist.length){
                await wishlist.save().catch((err)=>{
                    throw new BadRequestError('Error saving wish')
                })
                res.status(200).json([{message:'Wish added', success:true}])
            }
            else {
                await WishList.findOneAndDelete({userID:wish.userID, productID:wish.productID})
                res.status(200).json([{message:'Wish removed', success:false}]) 
            }
        } else {
            throw new BadRequestError('Not Authorized')
        }
    } 
    else{
        throw new BadRequestError('Not authorized')

    }
    
}