import express, {Request, Response} from "express";
import {check, validationResult} from "express-validator"
import { BadRequestError } from "../../errors/bad-request";
import { RequestValidationError } from "../../errors/request-validation-error";
import { Category } from "../../models/category-model";

const router = express.Router();

router.patch("/api/category/update-subcategory",
check(["_id", "subCategory"]).notEmpty(),
async (req:Request,res:Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
       throw new RequestValidationError(errors.array()) 
    }
    const {_id,subCategory} = req.body;
    const category = await Category.findByIdAndUpdate(_id, {$push:{subCategories:subCategory}}, {new:true})
    .catch((err)=>{
        console.log(err)
        throw new BadRequestError("SubCategory not updated")
    });
    res.status(200).json(category)
    

});


export {router as updateSubCategory}
