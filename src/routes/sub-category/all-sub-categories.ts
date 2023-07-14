import express, {Request, Response} from "express";
import { BadRequestError } from "../../errors/bad-request";
import { SubCategory } from "../../models/sub-category-model";
const router = express.Router();

router.get("/api/sub-category/all",
async (req:Request,res:Response)=>{
    const allSubCategories = await SubCategory.find({})
    .catch((err)=>{
        throw new BadRequestError("The sub-categories could not be fetched")
    });
    res.status(200).json(allSubCategories)
})

export {router as getAllSubCategories}