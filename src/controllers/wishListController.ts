import {Request, Response} from 'express'
import { WishList } from '../models/wishlist-model'
import { ServerError } from '../errors/server-error'
import { BadRequestError } from '../errors/bad-request'
import { IWishList } from '../types/wishlist'
import { Product } from '../models/product-model'

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
    if(req.currentUser?._id === wish.userID) {
            const wishlist = new WishList(wish);
            const wishExist:IWishList[] =  await WishList.find({productID:wish.productID, userID:req.currentUser?._id})
            const productExist = await Product.find({_id:wish.productID})
            if(!wishExist.length && !!productExist){
                await wishlist.save().catch((err)=>{
                    throw new BadRequestError('Error saving wish')
                })
                res.status(200).json([{message:'Wish added', success:true}])
            }
            else {
                throw new BadRequestError('Wish already exist')
            } 
    } else{
        throw new BadRequestError('Not authorized')
    }
}

// delete wish item
export const deleteWishListItem = async (req:Request, res:Response) => {
    const {...wish} = req.body
    if(req.currentUser){
        await WishList.findOneAndDelete({userID:req.currentUser._id, productID:wish.productID})
        .then((wish)=>{
            if(!wish) {
                res.status(404).json([{message:"Wish doesn't exist", success:false}])
            } else {
                res.status(200).json([{message:'Wish Removed', success:true}])
            }
        })
        .catch(()=>{
            throw new ServerError('An error occured deleting the wish')
        })
    }
    else {
        
        throw new BadRequestError('Not Authorized')

    }
}