import mongoose from "mongoose";

export interface ISubCategorySchema {
    name:string,
    imgURL:string, 
    altImgText:string,
    categoryName:string, 
    categoryID:string,
}

const SubCategorySchema = new mongoose.Schema<ISubCategorySchema>({
  name:{
    type:String,
    required:true,
  },
  imgURL:{
    type:String,
    required:true,
  },
  altImgText: {
    type:String,
    required:true,
  },
  categoryName:{
    type:String,
    required:true,
  }, 
  categoryID:{
    type:String, 
    required:false
  }

},{versionKey:false});

const SubCategory = mongoose.model("Sub Category", SubCategorySchema);


export {SubCategory}