import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyRoles } from "../middlewares/role.middleware.js";
import { getAdminDashboard, getStudentDashboard, postAdminDashboard } from "../controllers/dashboard.controller.js";

const router=Router();
// router.post('/admin/login',loginAdmin);
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
router.route('/user/login').post(loginUser);
router.route('/user/logout').post(verifyJWT, logoutUser);

//securing routes with middleware
//between login and dashboard load, it loads the correct dashboard based on the role
//verifyJWT checks if the token is valid
router.post('/admin/dashboard', verifyJWT, verifyRoles("admin"), postAdminDashboard);

router.get('/admin/dashboard', verifyJWT, verifyRoles("admin"), getAdminDashboard);
router.get('/student/dashboard', verifyJWT, verifyRoles("student"), getStudentDashboard);

export default router;