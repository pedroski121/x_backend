

export interface IOrder {
    userID:string;
    orderID:string;
    productIDAndQuantity:{productID:string, quantity:number, size:string, amountPaid:number};
    pickUpStationID:string;
    orderInitiationTime:string;
    totalAmountPaid:number;
    currentStatus:string,
    pendingDate:string,
    confirmedDate?:string,
    shippedDate?:string,
    deliveredDate?:string,
    referenceID:string
} 