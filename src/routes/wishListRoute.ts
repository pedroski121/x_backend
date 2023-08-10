import express from 'express';

import { getWishList } from '../controllers/wishListController';
import { addNewWishItem } from '../controllers/wishListController';
import { currentUser } from '../middlewares/current-user';
const router = express.Router()

router.get('/api/wishlist/:userID',currentUser, getWishList)
router.post('/api/wishlist/add',currentUser, addNewWishItem)

export {router as wishListRoutes}