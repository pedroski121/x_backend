import mongoose from "mongoose";

interface ICategorySchema {
    name:string,
    imgURL:string,
    subCategories:{
        name:string,
        imgURL?:string
    }[]
}

const CategorySchema = new mongoose.Schema<ICategorySchema>({
  name:{
    type:String,
    required:true,
    unique:true
  },
  imgURL:String,
  subCategories:[{ 
    name:String,
    imgURL:String
  }]
},{versionKey:false});

const Category = mongoose.model("Category", CategorySchema);


export {Category}