import {Request, Response} from 'express';
import { BadRequestError } from '../errors/bad-request';
import { RequestValidationError } from '../errors/request-validation-error';
import { User } from '../models/user-model';
import { validationResult, ValidationError} from 'express-validator';
import bcrypt from 'bcrypt';


const errorsArray = (errors:ValidationError[]):ValidationError[] =>{
    errors.map((error)=>{
        if(error.param === 'password'){
            error.msg = 'Password should have a minimum of 5 characters'
        } else if(error.param === 'firstName') {
            error.msg ='First Name should have a minimum of 1 character'
        } else if(error.param === 'lastName') {
            error.msg = "Last Name should have a minimum of 1 character"
        } else if(error.param === 'email'){
            error.msg = "Email address is not valid"
        }
        else {
            error.msg = 'Invalid credentials'
        }
       })
       return errors
}


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
        const allErrors = errorsArray(errors.array())
        throw new RequestValidationError(allErrors); 
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
        const allErrors = errorsArray(errors.array())
        throw new RequestValidationError(allErrors);
    }
    const newUser = req.body
    const existingUser = await User.findOne({email:newUser.email});
    if(existingUser) {
        throw new BadRequestError('Account already exists');
    }
    const hashedPassword = await bcrypt.hash(newUser.password,10);
    const user = new User({...newUser, password:hashedPassword});
    try {
        user.save()
        res.status(201).json([{success:true, message:'Registration successful'}]); 
    } catch (error) {
        throw new BadRequestError('An error occured while trying to save the user details')
    }

}


