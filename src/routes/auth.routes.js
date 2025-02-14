import { Router } from "express";
import { loginAdmin, loginUser, registerUser } from "../controllers/auth.controller.js";


const router=Router();
// admin login 
router.post('/admin/login',loginAdmin);
// user signup and login

//below route method allows:
// add middleware to handle files, as want to handle resume file from multer 
// add multiple http methods like get, post in the same route
// forms a proper chain of routing
router.route('/user/signup').post
( 
    upload.fields([
        {name: "resume", maxCount: 1}
    ]),
    registerUser
);

router.post('/user/login',loginUser);

export default router;