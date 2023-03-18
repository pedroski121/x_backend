import express, {Request, Response} from "express";
import { BadRequestError } from "../../errors/bad-request";
import { Category } from "../../models/category-model";
const router = express.Router();

router.get("/api/category/:name",
async (req:Request,res:Response)=>{
    const category = await Category.find({name:req.params.name})
    .catch((err)=>{
        throw new BadRequestError("The categories could not be fetched")
    });
    res.status(200).json(category)
})

export {router as findCategory}