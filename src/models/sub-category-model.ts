import mongoose from "mongoose";

interface ISubCategorySchema {
    name:string,
    imgURL:string, 
    altImgText:string,
    categoryName:string
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
  }

},{versionKey:false});

const SubCategory = mongoose.model("Sub Category", SubCategorySchema);


export {SubCategory}