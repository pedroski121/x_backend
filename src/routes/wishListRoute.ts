import express from 'express';
import { body } from 'express-validator';
import { deleteWishListItem, getWishList } from '../controllers/wishListController';
import { addNewWishItem } from '../controllers/wishListController';
import { currentUser } from '../middlewares/current-user';
import { requireAuth } from '@clerk/express';
// import { checkJwt } from '..';
const router = express.Router()

router.get('/api/wishlist',requireAuth(),getWishList)
router.post('/api/wishlist/add',requireAuth(), addNewWishItem)
router.delete('/api/wishlist/delete',body('userID').isString().notEmpty(),body('productID').isString().notEmpty(),requireAuth(), deleteWishListItem )

export {router as wishListRoutes}