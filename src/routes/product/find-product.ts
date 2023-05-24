import express, {Request, Response} from 'express';
import { BadRequestError } from '../../errors/bad-request';
import { Product } from '../../models/product-model';

const router = express.Router()

router.get("/api/product/:id",
async (req:Request,res:Response)=>{
    const productID = req.params.id;
    const product = await Product.findById(productID)
    .catch((err)=>{
        throw new BadRequestError("Product could not be found")
    });
    
    res.status(200).json(product);
    

})

export {router as findProduct}