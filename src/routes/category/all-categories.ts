import express, {Request, Response} from "express";
import { BadRequestError } from "../../errors/bad-request";
import { Category } from "../../models/category-model";
const router = express.Router();

router.get("/api/category/all",
async (req:Request,res:Response)=>{
    const allCategories = await Category.find({})
    .catch((err)=>{
        throw new BadRequestError("The categories could not be fetched")
    });
    res.status(200).json(allCategories)
})

export {router as getAllCategories}