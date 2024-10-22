import mongoose,{Document} from "mongoose";
import jwt from 'jsonwebtoken'
import { BadRequestError } from "../errors/bad-request";
import 'dotenv/config'

interface IUser {
    phoneNumber:number,
    additionalPhoneNumber:number,
    address1:string, 
    address2:string, 
    state:string, 
    city:string, 
    clerkUserID:string,
}
// interface IUserDocument extends IUser, Document {
//     generateAuthToken:(_id:string, email:string) => string; 
// }

const UserSchema = new mongoose.Schema<IUser>({
  
    phoneNumber:{
        type:Number, 
        required:false
    },
    additionalPhoneNumber:{
        type:Number,
        required:false 
    },
    address1:{
        type:String, 
        required:false,   
    },
    address2:{
        type:String, 
        required:false
    },
    state:{
        type:String, 
        required:false
    }, 
    city:{
        type:String, 
        required:false
    },
    clerkUserID:{
        type:String, 
        unique:true,
        required:true
    }


},{collection:'users',versionKey:false});

// UserSchema.methods.generateAuthToken = function (_id:string, email:string) {
// if(!process.env.JWT_SECRET_KEY) {
//     throw new BadRequestError('No secret key in environment');
// }
// const token = jwt.sign({_id, email}, process.env.JWT_SECRET_KEY, {
//     expiresIn:'24h'
// })
// return token;
// }

const User = mongoose.model<IUser>("User", UserSchema);
export {User}