import express from 'express';
import { body } from 'express-validator';


import { getBagList,addNewbagItem, deleteBagItem, emptyBag } from '../controllers/bagController';
import { currentUser } from '../middlewares/current-user';
const router = express.Router()

router.get('/api/bag/all',currentUser, getBagList)

router.post('/api/bag/add',currentUser,
body('productID').isString().notEmpty(), 
body('quantity').isInt({gt:0}), 
body('size').isString(), addNewbagItem)

router.delete('/api/bag/delete',body('_id').isString().notEmpty(),currentUser,deleteBagItem)
router.delete('/api/bag/empty-bag',currentUser, emptyBag)

export {router as bagRoutes}