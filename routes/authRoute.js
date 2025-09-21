import { register,signin,forgotPassword,resetPassword } from "../controllers/authController.js";
import express from "express"

const router=express.Router();

router.post('/register',register);
router.post('/signin',signin);
router.post('/forgot-password',forgotPassword);
router.put('/resetpassword/:token',resetPassword);


export default router;