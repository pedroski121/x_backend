import  {Request, Response} from "express";
import { BadRequestError } from "../errors/bad-request";
import { ServerError } from "../errors/server-error";
import { User } from "../models/user-model";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";

// controller to get all users
export const getUsers = async (req:Request,res:Response)=>{
    const {page = 1, limit=30} = req.query
    const allUsers = await User.find({})
    .select('fullName email')
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .catch(()=>{
        throw new BadRequestError("Users could not be fetched")
    });
    
    res.status(200).json(allUsers)
}
// controller to fetch the user count
export const getUserCount = async (req:Request,res:Response)=>{
    const userCount = await User.countDocuments({})
    .catch(()=>{
        throw new BadRequestError("Users could not be fetched")
    });
    res.status(200).json({userCount})
}

// controller to fetch a logged in user details
export const getUserDetails = async (req:Request, res:Response) => {
    const userID = req.params.id
    const user = await User.findById(userID)
    .catch(()=>{
        throw new BadRequestError('Error fetching user details')
    });
    res.status(200).json(user);
}

// update user details
export const updateUserDetails = async (req:Request, res:Response) => {
    const userID = req.params.id
    const {...userDetails} = req.body
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
       const errorsArray = errors.array()

       errorsArray.map((error)=>{
            if((error.param === 'phoneNumber' || error.param === 'additionalPhoneNumber') && (String(error.value).length !== 10 ) ) {
                error.msg = 'Phone number must be a valid Nigerian number' 
            }
            if(error.param === 'address1' || error.param === 'city' || error.param === 'state' ) {
                error.msg = 'Please enter a valid value'
            }

       })
       throw new RequestValidationError(errorsArray)
    }
    await User.findByIdAndUpdate(userID,userDetails,{new:true})
    .then(()=>{
        res.send([{message:'user details updated successfully', success:true}])
    })
    .catch(()=>{
        throw new ServerError('An Error occured saving the user details')
    })   
}