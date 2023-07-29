import {Request, Response} from 'express';
import { BadRequestError } from '../errors/bad-request';
import { RequestValidationError } from '../errors/request-validation-error';
import { User } from '../models/user-model';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

// controller to get the current user
export const getCurrentUser =(req:Request,res:Response)=>{
    if(req.currentUser){
        const {_id} = req.currentUser
        res.send([{currentUser:{_id}, success:true}]);
    } 
    else {
        res.send([{currentUser:null, success:false}])
    };
}


// controller to sign into your account 
export const signIn = async (req:Request, res:Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        throw new RequestValidationError(errors.array()); 
    }
    const email:string = req.body.email;
    const password:string = req.body.password;
    const user = await User.findOne({email});
    if(!user) {
        throw new BadRequestError('Account does not exists');
    }
    const passwordAuthenticity = await bcrypt.compare(password, user.password);
    if (!passwordAuthenticity) {
        throw new BadRequestError('Incorrect credentials')
    }
    const token = user.generateAuthToken(user._id, email);
    req.session = {
        jwt_token:token
    }
    res.status(201).send([{message:'Login successful',success:true}])
}

// controller to sign up for a new account 
export const signUp = async (req:Request, res:Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) { 
        throw new RequestValidationError(errors.array());
    }
    const {firstName, lastName, email, password} = req.body
    const existingUser = await User.findOne({email});
    if(existingUser) {
        throw new BadRequestError('Account already exists');
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const user = new User({firstName, lastName, email, password:hashedPassword});
    user.save((err)=>{
            if(err){
                 throw new BadRequestError('An error occured while saving the new user crendentials');
            } else {
                res.status(201).json([{success:true, message:'Registration successful'}]);
            }
        })
}
