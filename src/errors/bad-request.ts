import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
    statusCode = 404;
    constructor(public message:string) {
        super(message);
    }
    serializeErrors(): { message: string; success: boolean}[] {
        return [
            {
                message:this.message,
                success:false,
                
            }
        ]
    }
}