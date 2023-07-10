import express, { Request, Response} from 'express';
import { body ,validationResult} from 'express-validator';
import bcrypt from "bcrypt";
import { BadRequestError } from '../../errors/bad-request';
import { RequestValidationError } from '../../errors/request-validation-error';
import { User } from '../../models/user-model';

const router = express.Router();

router.post('/api/auth/sign-up',
 body('email').isEmail(),
 body('password').isLength({min:5}),
 body('fullName').isLength({min:2}),
async (req:Request, res:Response )=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) { 
        throw new RequestValidationError(errors.array());
    }
    const fullName:string = req.body.fullName; 
    const email:string = req.body.email;
    const password:string = req.body.password;
    const existingUser = await User.findOne({email});
    if(existingUser) {
        throw new BadRequestError('Account already exists');
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const user = new User({fullName, email,password:hashedPassword});

    user.save((err)=>{
            if(err){
                 throw new BadRequestError('An error occured while saving the new user crendentials');
            } else {
                res.status(201).json([{success:true, message:'Registration successful'}]);
            }
        })
})  

export {router as signUpRouter}