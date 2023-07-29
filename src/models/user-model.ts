import mongoose,{Document} from "mongoose";
import jwt from 'jsonwebtoken'
import { BadRequestError } from "../errors/bad-request";
import 'dotenv/config'

interface IUser {
    fullName : string,
    firstName:string, 
    lastName:string,
    email : string,
    password:string,
    phoneNumber:number,
    additionalPhoneNumber:number,
    address1:string,
    address2:string, 
    state:string,
    city:string
}
interface IUserDocument extends IUser, Document {
    generateAuthToken:(_id:string, email:string) => string; 
}

const UserSchema = new mongoose.Schema<IUserDocument>({
    firstName:{
        type:String,
        required:true, 
    },
    lastName:{
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
    },
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


},{collection:'users',versionKey:false});

UserSchema.methods.generateAuthToken = function (_id:string, email:string) {
if(!process.env.JWT_SECRET_KEY) {
    throw new BadRequestError('No secret key in environment');
}
const token = jwt.sign({_id, email}, process.env.JWT_SECRET_KEY, {
    expiresIn:'24h'
})
return token;
}

const User = mongoose.model<IUserDocument>("User", UserSchema);
export {User}