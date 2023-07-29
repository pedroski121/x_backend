import express,{ Request, Response } from "express";
import { validationResult} from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { BadRequestError } from "../errors/bad-request";
import { Product } from "../models/product-model";

const router = express.Router();

// controller to add a new product 
export const addProduct = (req:Request,res:Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let errorsArray = errors.array()
        errorsArray.map((error)=>{
            if(error.param == "price"){ 
                error.msg = "The price should not be less than 1"
            }
            if(error.param == "quantity"){
                error.msg="The product quantity should not be less than 1"
            }
        })
        throw new RequestValidationError(errorsArray);
    }
    const {...productDetails} = req.body;
    const product = new Product({...productDetails});
    product.save((err)=>{
        if(err){ 
            console.log(err)
            throw new BadRequestError("Unable to save product details")
        } else {
            res.status(201).json([{success:true, message:"saved successfully"}])
        }
    })

}
// controller to get all the available products in the database
export const getProducts = async (req:Request,res:Response)=>{
    const allProducts = await Product.find()
    .sort({_id:-1})
    .catch((err)=>{
        throw new BadRequestError("The products could not be fetched")
    });
    res.status(200).json(allProducts)
}

router.get("/api/product/:id",
async (req:Request,res:Response)=>{
    const productID = req.params.id;
    const product = await Product.findById(productID)
    .catch((err)=>{
        throw new BadRequestError("Product could not be found")
    });
    
    res.status(200).json(product);
})


// controller to get a single product using the product id
export const getProduct = async (req:Request,res:Response)=>{
    const productID = req.params.id;
    const product = await Product.findById(productID)
    .catch((err)=>{
        throw new BadRequestError("Product could not be found")
    });
    
    res.status(200).json(product);
}


// controller to update a product details
export const updateProduct = async (req:Request,res:Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
       throw new RequestValidationError(errors.array())
    }
    const {_id,...productDetails} = req.body;
    const product = await Product.findByIdAndUpdate(_id,productDetails,{new:true})
    .catch((err)=>{
        console.log(err)
        throw new BadRequestError("Product not updated")
    });
    res.status(200).json(product) 
}

// controller to delete product 

export const deleteProduct =async  (req:Request, res: Response) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new RequestValidationError(errors.array());
    }
    const productDetails = req.body;
    const product = await Product.findByIdAndDelete(productDetails._id)
    .catch((err)=>{
        throw new BadRequestError("Product not deleted")
    });

    res.status(200).json([{success:true, message:"deleted successfully"}])
}

