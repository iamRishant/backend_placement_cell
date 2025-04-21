import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyRoles } from "../middlewares/role.middleware.js";
import { verifyEmail } from "../middlewares/verifyEmail.middleware.js";
import { getAdminDashboard, getStudentDashboard, registerCompany, updateCompany } from "../controllers/dashboard.controller.js";
import { getCurrentUser, updateResume } from "../controllers/user.controller.js";

const router=Router();

//below route method allows:
// add middleware to handle files, as want to handle resume file from multer 
// add multiple http methods like get, post in the same route
// forms a proper chain of routing

router.route('/user/verify-email').post(verifyEmail);

router.route('/user/signup')
    .post( 
        upload.fields([
            {name: "resume", maxCount: 1}
        ]),
        registerUser
    );
router.route('/user/login').post(loginUser);
router.route('/user/logout').post(verifyJWT, logoutUser);


// securing routes with middleware
// between login and dashboard load, it loads the correct dashboard based on the role
// verifyJWT checks if the token is valid 

router.route('/admin/dashboard')
.get(verifyJWT, verifyRoles("admin"), getAdminDashboard);

router.route('/register-company')   
.post(verifyJWT, verifyRoles("admin"), registerCompany);

router.get('/student/dashboard', verifyJWT, verifyRoles("student","admin"), getStudentDashboard);

router.post('/student/update-resume',
    verifyJWT,
    upload.fields([
    {name: "resume", maxCount: 1}]),
    updateResume
);
router.get('/student/get-user-details',verifyJWT,getCurrentUser);

router.post('/admin/update-company',verifyJWT,updateCompany);

export default router;