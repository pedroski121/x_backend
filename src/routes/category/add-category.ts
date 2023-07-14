import express,{ Request, Response } from "express";
import {check, validationResult} from "express-validator";
import { RequestValidationError } from "../../errors/request-validation-error";
import { BadRequestError } from "../../errors/bad-request";
import { Category } from "../../models/category-model";

const router = express.Router();

router.post('/api/category/add', check(["name"], check(["imgURL"])).notEmpty(),
async (req:Request,res:Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new RequestValidationError(errors.array());
    }
    const {name, imgURL} = req.body;
    const category = new Category({name, imgURL});
    const existingCategory = await Category.findOne({name})
    if(existingCategory){
        throw new BadRequestError('Category already exists')
    }
    category.save((err)=>{
        if(err){
             throw new BadRequestError('Cannot save category details');
        } else {
            res.status(201).json([{success:true, message:'Category Saved'}]); 
        }
    }) 

});

export {router as addNewCategory}
