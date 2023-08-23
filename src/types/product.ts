export type  TProduct = {
    name:string,
    price:number,
    category:string,
    subCategory:string,
    specification:string,
    storeID:string,
    storeName:string,
    rating:number,
    quantity:number,
    sizes:string[],
    imgURLs?:string[], 
    imgAltText?:string,
    reviews?:{userID:string, review:string, date:string, time:string}[]
}