import express, {Request, Response} from "express";
import { BadRequestError } from "../../errors/bad-request";
import { User } from "../../models/user-model";
const router = express.Router();

router.get("/api/user/all",
async (req:Request,res:Response)=>{
    const allUsers = await User.find({})
    .catch((err)=>{
        throw new BadRequestError("Users could not be fetched")
    });
    res.status(200).json(allUsers)
})

export {router as getAllUsers}