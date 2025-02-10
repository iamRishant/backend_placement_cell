import { Router } from "express";
import { loginAdmin, loginUser, registerUser } from "../controllers/auth.controller.js";


const router=Router();
// admin login 
router.post('/admin/login',loginAdmin);
// user signup and login
router.post('/user/signup',registerUser);
router.post('/user/login',loginUser);

export default router;