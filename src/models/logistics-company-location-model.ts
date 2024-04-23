import mongoose from "mongoose";
import { ILogisticsCompanyLocation } from "../types/logistics-company-location";

const LogisticsCompanyLocationSchema = new mongoose.Schema<ILogisticsCompanyLocation>({
 
    logisticsCompany:{
        required:true, 
        type:String
    }, 
   state:{
        required:true, 
        type:String
    }, 
   city:{
        required:true, 
        type:String
    }, 
    address:{
        required:true,
        type:String,
        unique:true
    }

}, {collection:'LogisticsCompanyLocation', versionKey:false})

const LogisticsCompanyLocations = mongoose.model('LogisticsCompanyLocation',LogisticsCompanyLocationSchema)

export {LogisticsCompanyLocations}