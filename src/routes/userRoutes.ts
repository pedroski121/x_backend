import express from "express";
import { getUsers, getUserCount, getUserDetails } from "../controllers/userController";


const router = express.Router();
router.get("/api/user/all",getUsers)
router.get('/api/user/count',getUserCount)
router.get('/api/user/:id', getUserDetails)

export {router as userRoutes}