import express, {Request, Response} from "express";
import { body, validationResult } from "express-validator";
import { BadRequestError } from "../../errors/bad-request";
import { RequestValidationError } from "../../errors/request-validation-error";
import { Category } from "../../models/category-model";
const router = express.Router();

router.delete("/api/category/delete",
    body("_id").notEmpty(),
async (req:Request, res:Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new RequestValidationError(errors.array());
    }
    const categoryDetails = req.body;
    const category = await Category.findByIdAndDelete(categoryDetails._id)
    .catch((err)=>{
        throw new BadRequestError("Product not deleted")
    });

    res.status(200).json([{success:true, message:"deleted successfully"}])
})

export {router as deleteCategory}