const router = express.Router();
import express from "express";
import bcrypt from "bcryptjs";
import authController from "../controllers/auth.controller.js";


router.post("/sign_up", authController.SignUp);
router.post("/sign_in",  authController.SignIn);
router.post("/forgot_password",  authController.Forgot_Password);
router.post("/update_password", authController.Update_Password)

export default router;
