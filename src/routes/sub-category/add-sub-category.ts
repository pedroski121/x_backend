import express,{ Request, Response } from "express";
import {check, validationResult} from "express-validator";
import { RequestValidationError } from "../../errors/request-validation-error";
import { BadRequestError } from "../../errors/bad-request";
import { SubCategory } from "../../models/sub-category-model";
import { ISubCategorySchema } from "../../models/sub-category-model";

const router = express.Router();

router.post('/api/sub-category/add',
check(["name", "imgURL", "altImgText", "categoryName"]).notEmpty(),
async (req:Request,res:Response)=>{
    const errors = validationResult(req); 
    if(!errors.isEmpty()){
        let errorsArray = errors.array()
        errorsArray.map((error)=>{
            if(error.param == "imgURL"){ 
                error.msg = "An Image for this Sub category should be created"
            }
            if(error.param == "name"){
               error.msg="There is no name for this sub category"
            }
            if(error.param == "categoryName"){
                error.msg="There is no name set for the category this sub-category belong to"
            } 
            if(error.param == "altImgText"){
                error.msg="There is no alt text for the image that re for this category"
            }
        })
        throw new RequestValidationError(errorsArray);
    }
    const {...newSubCategory}:ISubCategorySchema = req.body;
    const existingSubCategory = await SubCategory.findOne({name:newSubCategory.name})
    if(existingSubCategory && existingSubCategory.categoryName === newSubCategory.categoryName ){
       throw new BadRequestError(`This sub-category already exists in the ${newSubCategory.categoryName} category`)
    }
    const subCategory = new SubCategory({...newSubCategory});

    subCategory.save((err)=>{
        if(err){ 
            throw new BadRequestError("Unable to create new subCategory")
        } else {
            res.status(201).json([{success:true, message:"New Sub Category Created"}])
        }
    })

});

export {router as addNewSubCategory}
