import { CustomError } from "./custom-error";
import { ValidationError } from "express-validator";

export class RequestValidationError extends CustomError {
    statusCode = 400;
    constructor(public errors:ValidationError[]) {
        super('Invalid credentials');
        
    }
    serializeErrors() {
        return this.errors.map((error)=>{
                if(error.param === 'password'){
                    this.message = 'Password should have a minimum of 5 characters'
                } else if(error.param === 'fullName') {
                    this.message ='Full Name should have a minimum of 2 characters '
                } 
                else {
                    this.message = 'Invalid credentials'
                }
            return  {message:this.message, success:false, field:error.param}})
    }
}