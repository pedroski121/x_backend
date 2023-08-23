import { Request } from "express"

export type TBag = {
    userID:string, 
    productID:string,
    quantity:number,
    size:string,
    _id:string,
}

export interface BagBody<T> extends Request {
    body: T
}