import {Request, Response, NextFunction} from 'express';

import { CustomError } from '../errors/custom-error';

export const errorHandler = (err:CustomError,req:Request,res:Response,next:NextFunction) => {
    if(err instanceof CustomError) {
        return res.status(err.statusCode).send(err.serializeErrors());
    }
    res.status(400).send(
        [{message:'Something went wrong', success:false}]
    )
} 