import express, {Request, Response} from "express";
import { BadRequestError } from "../../errors/bad-request";
import { User } from "../../models/user-model";



const router = express.Router();
router.get("/api/user/count",
async (req:Request,res:Response)=>{
    const userCount = await User.countDocuments({})
    .catch((err)=>{
        throw new BadRequestError("Users could not be fetched")
    });
    res.status(200).json({userCount})
})

export {router as userCount}