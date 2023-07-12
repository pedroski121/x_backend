import express,{ Request, Response } from "express";
import {check, validationResult} from "express-validator";
import { RequestValidationError } from "../../errors/request-validation-error";
import { BadRequestError } from "../../errors/bad-request";
import { Category } from "../../models/category-model";

const router = express.Router();

router.post('/api/category/add',
check(["name"], check(["imgURL"])).notEmpty(),
(req:Request,res:Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new RequestValidationError(errors.array());
    }
    const {...categoryDetails} = req.body;
    const category = new Category({...categoryDetails});
    category.save((err)=>{
        if(err){ 
            throw new BadRequestError("Unable to save category details")
        } else { 
            res.status(201).json([{success:true, message:"saved successfully"}])
        }
    }) 

});

export {router as addNewCategory}
