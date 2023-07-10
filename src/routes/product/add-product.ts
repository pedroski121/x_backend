import express,{ Request, Response } from "express";
import {check, validationResult} from "express-validator";
import { RequestValidationError } from "../../errors/request-validation-error";
import { BadRequestError } from "../../errors/bad-request";
import { Product } from "../../models/product-model";

const router = express.Router();

router.post('/api/product/add',
check(["name", "price", "category", "subCategory", "specification", "storeID","storeName","quantity"]).notEmpty(),
check(["price","quantity"]).isInt({gt:0}),
(req:Request,res:Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let errorsArray = errors.array()
        errorsArray.map((error)=>{
            if(error.param == "price"){ 
                error.msg = "The price should not be less than 1"
            }
            if(error.param == "quantity"){
                error.msg="The product quantity should not be less than 1"
            }
        })
        throw new RequestValidationError(errorsArray);
    }
    const {...productDetails} = req.body;
    const product = new Product({...productDetails});
    product.save((err)=>{
        if(err){ 
            console.log(err)
            throw new BadRequestError("Unable to save product details")
        } else {
            res.status(201).json([{success:true, message:"saved successfully"}])
        }
    })

});

export {router as addNewProduct}
