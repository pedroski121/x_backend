import express, {Request, Response} from "express";
import { Product } from "../../models/product-model";
import { body, validationResult } from "express-validator";
import { BadRequestError } from "../../errors/bad-request";
import { RequestValidationError } from "../../errors/request-validation-error";
const router = express.Router();

router.delete("/api/product/delete",
    body("_id").notEmpty(),
async (req:Request, res:Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new RequestValidationError(errors.array());
    }
    const productDetails = req.body;
    const product = await Product.findByIdAndDelete(productDetails._id)
    .catch((err)=>{
        throw new BadRequestError("Product not deleted")
    });

    res.status(200).json([{success:true, message:"deleted successfully"}])
})

export {router as deleteProduct}