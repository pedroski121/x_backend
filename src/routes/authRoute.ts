import { getCurrentUser, signIn, signUp } from "../controllers/authController";
import express from 'express'
import { currentUser } from "../middlewares/current-user";
import { body } from "express-validator";
const router = express.Router();


router.get('/api/auth/current-user', currentUser, getCurrentUser);
router.post('/api/auth/sign-in', body('email').isEmail(),body('password').isLength({min:5}),signIn)
router.post('/api/auth/sign-up', 
     body('email').isEmail(),
     body('password').isLength({min:5}),
     body('lastName'),
     body('firstName').isLength({min:1}),
     signUp
)


export {router as authRoutes}
