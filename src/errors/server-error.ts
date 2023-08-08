import { CustomError } from "./custom-error";

export class ServerError extends CustomError {
    statusCode = 500;
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