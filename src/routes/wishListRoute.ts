import express from 'express';
import { body } from 'express-validator';
import { deleteWishListItem, getWishList } from '../controllers/wishListController';
import { addNewWishItem } from '../controllers/wishListController';
import { currentUser } from '../middlewares/current-user';
// import { checkJwt } from '..';
const router = express.Router()

router.get('/api/wishlist/:userID',currentUser,getWishList)
router.post('/api/wishlist/add',currentUser, addNewWishItem)
router.delete('/api/wishlist/delete',body('userID').isString().notEmpty(),body('productID').isString().notEmpty(),currentUser, deleteWishListItem )

export {router as wishListRoutes}