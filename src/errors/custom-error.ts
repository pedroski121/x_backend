export abstract class CustomError extends Error {
    abstract statusCode:number;
    constructor(message:string) {
        super(message);       
    }
    abstract serializeErrors():{
        message:string;
        success:boolean;
        field?:string
    }[]
}