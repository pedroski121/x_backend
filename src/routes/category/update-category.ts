import express, {Request, Response} from "express";
import {body, validationResult} from "express-validator"
import { BadRequestError } from "../../errors/bad-request";
import { RequestValidationError } from "../../errors/request-validation-error";
import { Category } from "../../models/category-model";

const router = express.Router();

router.patch("/api/category/update",
body("_id").notEmpty(),
async (req:Request,res:Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
       throw new RequestValidationError(errors.array())
    }
    const categoryDetails = req.body;
    const category = await Category.findByIdAndUpdate(categoryDetails._id,categoryDetails,{new:true})
    .catch((err)=>{
        console.log(err)
        throw new BadRequestError("Category not updated")
    });
    res.status(200).json(category)
    

});


export {router as updateCategory}
