import { apiError } from "../utils/apiError.js";

const getAdminDashboard = async (req, res) => {
    if(req.user.role !== "admin") {
        throw new apiError(403, "Unauthorized Admin Access!!!");
    }
    res.status(200).json({ message: "Admin dashboard loaded successfully" });
}

const getStudentDashboard = async (req, res) => {
    if(req.user.role !== "student") {
        throw new apiError(403, "Unauthorized Student Access!!!");
    }  
    res.status(200).json({ message: "Student dashboard loaded successfully" });
}

export { getAdminDashboard, getStudentDashboard };