import mongoose from "mongoose";
import { IWishList } from "../types/wishlist";


const WishListSchema = new mongoose.Schema<IWishList>({
    userID:{
        required:true,
        type:String
    },
    productID:{
        required:true,
        type:String
    }
}, {collection:'wishlist', versionKey:false})

const WishList = mongoose.model('WishList',WishListSchema)

export {WishList}