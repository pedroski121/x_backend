import { Request } from "express"

export type TBag = {
    productID:string,
    quantity:number,
    size:string,
    _id:string,
    userID?:string
}

export interface BagBody<T> extends Request {
    body: T
}