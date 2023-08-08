import express from 'express'
import { body, check } from 'express-validator';
import { addProduct, deleteProduct, getProducts, getProduct,updateProduct } from '../controllers/productController';


const router = express.Router();


router.post('/api/product/add', check(["name", "price", "category", "subCategory", "specification", "storeID","storeName","quantity"]).notEmpty(), check(["price","quantity"]).isInt({gt:0}),addProduct)
router.get('/api/product/all', getProducts)
router.get('/api/product/:id', getProduct)
router.patch('/api/product/update',body("_id").notEmpty(),updateProduct)
router.delete('/api/product/delete',body("_id").notEmpty(),deleteProduct)


export {router as productRoutes}
