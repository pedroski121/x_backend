export interface IOrder {
    userID:string;
    orderID:string;
    productID:string;
    pickUpStationID:string;
    orderInitiationTime:string;
    quantity:number;
    size:string;
    amountPaid:number;
    currentStatus:string,
    pendingDate:string,
    confirmedDate?:string,
    shippedDate?:string,
    deliveredDate?:string,

} 