import { Request, Response } from "express";
import { validationResult} from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { BadRequestError } from "../errors/bad-request";
import { LogisticsCompanyLocations } from "../models/logistics-company-location-model";
import { ServerError } from "../errors/server-error";
import { toTitleCase } from "../utils/toTitleCase";

// controller to add a new product 
export const addLogisticsCompanyLocation =  (req:Request,res:Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let errorsArray = errors.array()
        errorsArray.map((error)=>{
            if(error.param == "logisticsCompany"){ 
                error.msg = "Please the logistics company should be GAVICE or GIGL"
            }
            if(error.param == "state"){
                error.msg="Please indicate the state of this branch"
            }
            if(error.param == "city"){
                error.msg = "Please state the city of this branch"
            }
            if(error.param == "address"){
                error.msg = "Please what is the address of this branch"
            }
        })
        throw new RequestValidationError(errorsArray);
    }
    const {...logisticsCompanyLocationDetails} = req.body;
    const logisticsCompanyLocation = new LogisticsCompanyLocations({...logisticsCompanyLocationDetails});
     logisticsCompanyLocation.save((err)=>{
        if(err){ 
            const error = new ServerError("Unable to save this company details");
            console.error(err)
            res.status(500).json({success:false, message:error.message})
        } else {
            res.status(201).json({success:true, message:"saved successfully"})
        }
    })

}
// controller to get all the available products in the database
export const getLogisticsCompanyLocations = async (req:Request,res:Response)=>{
    const allLogisticsLocations = await LogisticsCompanyLocations.find()
    .sort({_id:-1})
    .catch((err)=>{
        throw new BadRequestError("The locations could not be fetched")
    });
    res.status(200).json(allLogisticsLocations)
}


export const getLogisticsCompanyLocationsInState = async (req:Request, res:Response) => {
    const state = toTitleCase(req.params.state);
    const logisticsCompanyLocations = await LogisticsCompanyLocations.find({state})
    .catch((err)=>{
        const error = new ServerError("Error Fetching Products")
        console.error(err)
        res.status(500).json({success:false, message:error.message})
    });
    
    res.status(200).json(logisticsCompanyLocations);
}