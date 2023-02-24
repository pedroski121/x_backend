import express, {Request, Response} from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { BadRequestError } from '../../errors/bad-request';
import { RequestValidationError } from '../../errors/request-validation-error';
import { User } from '../../models/user-model';

const router = express.Router()

router.post('/api/auth/sign-in', 
body('email').isEmail(),
body('password').isLength({min:5}),
async (req:Request, res:Response) =>{
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
})

export {router as signInRouter}
