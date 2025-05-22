const router = express.Router();
import express from "express";
import bcrypt from "bcryptjs";
import authController from "../controllers/auth.controller.js";


router.post("/sign-up", authController.SignUp);
router.post("/sign-in",  authController.SignIn);

export default router;
