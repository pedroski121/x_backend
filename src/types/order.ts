

export interface IOrder {
    userID:string;
    orderID:string;
    productDetails:{
        productID:string, 
        quantity:number, 
        size:string, 
        amountPaid:number ,
        currentStatus:string,
        pendingDate:string,
        confirmedDate?:string,
        shippedDate?:string,
        deliveredDate?:string,};
    pickUpStationID:string;
    orderInitiationTime:string;
    totalAmountPaid:number;

    referenceID:string
} 