export type  TProduct = {
    name:string,
    price:number,
    category:string,
    subCategory:string,
    specification:string,
    storeID:string,
    storeName:string,
    storePhoneNumber:number,
    rating:number,
    quantity:number,
    sizes:string[],
    imgURLs?:string[], 
    imgAltText?:string,
    reviews?:{userID:string, review:string, date:string, time:string}[]
}