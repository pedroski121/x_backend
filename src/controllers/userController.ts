import  {Request, Response} from "express";
import { BadRequestError } from "../errors/bad-request";
import { User } from "../models/user-model";

// controller to get all users
export const getUsers = async (req:Request,res:Response)=>{
    const {page = 1, limit=30} = req.query
    const allUsers = await User.find({})
    .select('fullName email')
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .catch((err)=>{
        throw new BadRequestError("Users could not be fetched")
    });
    
    res.status(200).json(allUsers)
}

// controller to fetch the user count
export const getUserCount = async (req:Request,res:Response)=>{
    const userCount = await User.countDocuments({})
    .catch((err)=>{
        throw new BadRequestError("Users could not be fetched")
    });
    res.status(200).json({userCount})
}


// controller to fetch a logged in user details
export const getUserDetails = async (req:Request, res:Response) => {
    const userID = req.params.id
    const user = await User.findById(userID).catch((err)=>{
        throw new BadRequestError('Error fetching user details')
    });
    res.status(200).json(user);
}