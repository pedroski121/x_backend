import express, {Request, Response} from "express";
import { BadRequestError } from "../../errors/bad-request";
import { Product } from "../../models/product-model";
const router = express.Router();

router.get("/api/product",
async (req:Request,res:Response)=>{
   const productsInCategory = await Product.find({category:req.query?.category})
    .catch((err)=>{
        throw new BadRequestError("The products for the category could not be fetched")
    });
    res.status(200).json(productsInCategory) 
})
 
export {router as queryProductsBasedOnCategory} 