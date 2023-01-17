import mongoose,{Document} from "mongoose";
import jwt from 'jsonwebtoken'
import { BadRequestError } from "../errors/bad-request";
import 'dotenv/config'

interface IUser {
    fullName : string,
    email : string,
    password:string
}
interface IUserDocument extends IUser, Document {
    generateAuthToken:(_id:string, email:string) => string; 
}

const UserSchema = new mongoose.Schema<IUserDocument>({
    fullName: {
        type:String,
        required:true
    },
    email: {
        type:String, 
        required:true,
    },
    password: {
        type:String,
        required:true
    }
},{collection:'users',versionKey:false});

UserSchema.methods.generateAuthToken = function (_id:string, email:string) {
if(!process.env.JWT_SECRET_KEY) {
    throw new BadRequestError('No secret key in environment');
}
const token = jwt.sign({_id, email}, process.env.JWT_SECRET_KEY)
return token;
}

const User = mongoose.model<IUserDocument>("User", UserSchema);
export {User}