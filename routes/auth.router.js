const router = express.Router();
import express from "express";
import authController from "../controllers/auth.controller.js";


router.post("/sign-up", authController.SignUp);

export default router;
