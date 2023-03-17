import express, {Request, Response} from "express";
import {body, validationResult} from "express-validator"
import { BadRequestError } from "../../errors/bad-request";
import { RequestValidationError } from "../../errors/request-validation-error";
import {Product} from '../../models/product-model';


const router = express.Router();

router.patch("/api/product/update",
body("_id").notEmpty(),
async (req:Request,res:Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
       throw new RequestValidationError(errors.array())
    }
    const productDetails = req.body;
    const product = await Product.findByIdAndUpdate(productDetails._id,productDetails,{new:true})
    .catch((err)=>{
        throw new BadRequestError("Product not updated")
    });
    res.status(200).json(product)
    

});


export {router as updateProduct}
