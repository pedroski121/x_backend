import express from 'express';
import { body } from 'express-validator';


import { getBagList,addNewbagItem, deleteBagItem, emptyBag } from '../controllers/bagController';
import { currentUser } from '../middlewares/current-user';
import { requireAuth } from '@clerk/express';
const router = express.Router()

router.get('/api/bag/all',requireAuth(), getBagList)

router.post('/api/bag/add',requireAuth(),
body('productID').isString().notEmpty(), 
body('quantity').isInt({gt:0}), 
body('size').isString(), 
addNewbagItem)

router.delete('/api/bag/delete',body('_id').isString().notEmpty(),requireAuth(),deleteBagItem)
router.delete('/api/bag/empty-bag',requireAuth(), emptyBag)

export {router as bagRoutes}