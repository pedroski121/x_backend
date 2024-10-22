import express from "express";
import { body } from "express-validator";

import { getUsers, getUserCount, getUserDetails, updateUserDetails } from "../controllers/userController";
import { requireAuth } from '@clerk/express';

const router = express.Router();
router.get("/api/user/all",getUsers)
router.get('/api/user/count',getUserCount)
router.get('/api/user', getUserDetails)
router.patch('/api/user/update-details', body('phoneNumber').isLength({min:10, max:10}).isInt().notEmpty(),
                                             body('additionalPhoneNumber').isInt().isLength({min:10, max:10}).optional(), 
                                             body('address1').isString().notEmpty(),
                                             body('state').isString().notEmpty(),
                                             body('city').isString().notEmpty(), requireAuth(), updateUserDetails)

export {router as userRoutes} 