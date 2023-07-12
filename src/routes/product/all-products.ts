import express, {Request, Response} from "express";
import { BadRequestError } from "../../errors/bad-request";
import { Product } from "../../models/product-model";
const router = express.Router();

router.get("/api/product/all",
async (req:Request,res:Response)=>{
    const allProducts = await Product.find()
    .sort({_id:-1})
    .catch((err)=>{
        throw new BadRequestError("The products could not be fetched")
    });
    res.status(200).json(allProducts)
})

export {router as getAllProducts}