import express from 'express';
import { body } from 'express-validator';


import { getBagList,addNewbagItem, deleteBagItem  } from '../controllers/bagController';
import { currentUser } from '../middlewares/current-user';
const router = express.Router()

router.get('/api/bag',currentUser, getBagList)

router.post('/api/bag/add',
currentUser,
body('productID').isString().notEmpty(), 
body('quantity').isInt({gt:0}), 
body('size').isString().notEmpty(), 
addNewbagItem)

router.delete('/api/bag/delete',
body('productID').isString().notEmpty(),
currentUser,
deleteBagItem)

export {router as bagRoutes}