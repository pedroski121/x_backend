import express from 'express'
import { body, check } from 'express-validator';
import { addSubCategory, getAllSubCategories, getCategorySubCategories } from '../controllers/subCategoryController';

const router = express.Router();

router.post('/api/sub-category/add',check(["name", "imgURL", "altImgText", "categoryName"]).notEmpty(),addSubCategory)
router.get('/api/sub-category/all', getAllSubCategories)
router.get('/api/sub-category/:categoryName',getCategorySubCategories)
// router.delete('/api/sub-category/delete',body('_id').notEmpty(), deleteCategory)
// router.patch('/api/sub-category/update', body("_id").notEmpty(),updateCategory)


export {router as subCategoryRoutes}
