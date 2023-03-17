import express, {Request, Response} from 'express';
import { BadRequestError } from '../../errors/bad-request';
import { Product } from '../../models/product-model';

const router = express.Router()

router.post("/api/product/find",
async (req:Request,res:Response)=>{
    const productDetails = req.body;
    const product = await Product.find({...productDetails})
    .catch((err)=>{
        throw new BadRequestError("Product could not be found")
    });
    if(product.length == 0){
        res.json([{message:"No product found", success:false}]);
    }
    else {
        res.status(200).json(product);
    }

})

export {router as findProduct}