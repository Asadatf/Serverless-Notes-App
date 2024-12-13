import express from "express";
import {
  signupUser,
  loginUser,
  forgetPassword,
  resetPassword,
  userProfile,
} from "../controllers/userController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

// forget and reset Password routes
router.post("/forgetPassword", forgetPassword);
router.post("/reset-password/:token", resetPassword);

// profile route
router.post("/profile", requireAuth, userProfile);

export default router;
