import { Request, Response } from "express";
import { validationResult} from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { BadRequestError } from "../errors/bad-request";
import { Category } from "../models/category-model";


// controller to create a new category
export const postCategory =async  (req:Request, res:Response) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new RequestValidationError(errors.array());
    }
    const {name, imgURL} = req.body;
    const category = new Category({name, imgURL});
    const existingCategory = await Category.findOne({name})
    if(existingCategory){
        throw new BadRequestError('Category already exists')
    }
    category.save((err)=>{
        if(err){
             throw new BadRequestError('Cannot save category details');
        } else {
            res.status(201).json([{success:true, message:'Category Saved'}]); 
        }
    }) 
}


// controller to get all categories
export const getCategories = async (req:Request,res:Response)=>{
    const allCategories = await Category.find({})
    .catch((err)=>{
        throw new BadRequestError("The categories could not be fetched")
    });
    res.status(200).json(allCategories)
}

// controller to delete a category
export const deleteCategory = async (req:Request, res:Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new RequestValidationError(errors.array());
    }
    const categoryDetails = req.body;
    const category = await Category.findByIdAndDelete(categoryDetails._id)
    .catch((err)=>{
        throw new BadRequestError("Product not deleted")
    });

    res.status(200).json([{success:true, message:"deleted successfully"}])
}

// controller update category details
export const updateCategory = async (req:Request,res:Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
       throw new RequestValidationError(errors.array())
    }
    const categoryDetails = req.body;
    const category = await Category.findByIdAndUpdate(categoryDetails._id,categoryDetails,{new:true})
    .catch((err)=>{
        throw new BadRequestError("Category not updated")
    });
    res.status(200).json(category)
}




// controller to find category
export const getCategory = async (req:Request,res:Response)=>{
    const category = await Category.find({name:req.params.name})
    .catch((err)=>{
        throw new BadRequestError("The categories could not be fetched")
    });
    res.status(200).json(category)
}