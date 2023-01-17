import express, { Request, Response} from 'express';
import { body ,validationResult,Result} from 'express-validator';
import bcrypt from "bcrypt";
import { BadRequestError } from '../../errors/bad-request';
import { RequestValidationError } from '../../errors/request-validation-error';
import { User } from '../../models/user_model';

const router = express.Router();

router.post('/api/user/sign-up', body('email').isEmail(),body('password').isLength({min:5, max:15}),
async (req:Request, res:Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        throw new RequestValidationError(errors.array())
    }
    const fullName:string = req.body.fullName;
    const email:string = req.body.email;
    const password:string = req.body.password;
    const existingUser = await User.findOne({email});
    if(existingUser) {
        throw new BadRequestError('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const user = new User({fullName, email,password:hashedPassword});

    user.save((err)=>{
            if(err){
                 throw new BadRequestError('An error occured while saving the new user crendentials');
            } else {
                const token = user.generateAuthToken(user._id, email); 
                req.session = {
                    jwt_token:token
                }
                res.status(201).send([{success:true, message:'Registration successful'}]);
            }
        })
})  

export default router