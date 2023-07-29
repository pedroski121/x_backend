import express from 'express'
import { body, check } from 'express-validator';
import { postCategory,getCategory, getCategories, deleteCategory, updateCategory} from '../controllers/categoryController';

const router = express.Router();

router.post('/api/category/add',check(["name"], check(["imgURL"])).notEmpty(),postCategory)
router.get('/api/category/all', getCategories)
router.delete('/api/category/delete',body('_id').notEmpty(), deleteCategory)
router.patch('/api/category/update', body("_id").notEmpty(),updateCategory)
router.get('/api/category/:name',getCategory)


export {router as categoryRoutes}
