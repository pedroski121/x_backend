import { Request, Response, NextFunction } from "express";
import  jwt  from "jsonwebtoken";

interface UserPayload{
    _id:string;
    email:string;
    iat:number;
    exp:number;

}
declare global {
    namespace Express {
      interface Request {
        currentUser?: UserPayload;
      }
    }
  }
const currentUser = (req:Request, res:Response, next:NextFunction) => {
    if(!req.session?.jwt_token || !process.env.JWT_SECRET_KEY) {
       return next()
    }
    try {

        const payload =  jwt.verify(req.session.jwt_token,process.env.JWT_SECRET_KEY) as UserPayload
        req.currentUser = payload
        next()
    } catch (err) {
        console.log(err)
    }
}
export {currentUser}