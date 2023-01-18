import { CustomError } from "./custom-error";
export class NotFoundError extends CustomError {
    statusCode:number = 404;
    constructor(public message:string='Requested URL could not found') {
        super(message);
    }
    serializeErrors():{message:string, success:boolean}[] {
        return [{message:this.message, success:false}] 
    }
}