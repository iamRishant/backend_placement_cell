import { Placement } from "../models/placement.model.js";
import { apiError } from "../utils/apiError.js";

const registerCompany = async (req, res) =>{
    try {
        //get the details of the company
        //check for null fields
        //existed or not
        //save the company in the database
        //return the company object

        const { companyName, companyInfo, jobTitle, 
            jobDescription, eligibility, payPackage, bond, 
            bondDescription, formDeadline, registerationLink } = req.body;
        
        if(
            [companyName, companyInfo, jobTitle, eligibility, payPackage, 
                bond, formDeadline, registerationLink].some((field) => field?.trim() === "")
        ){
            throw new apiError(400, "All fields are required.");
        }

        const existedCompany = await Placement.findOne({
            companyName: companyName.toLowerCase()
        });
        
        if(existedCompany){
            throw new apiError(409, "Company already exists.");
        }

        const company = await Placement.create({
            companyName: companyName.toLowerCase(),
            companyInfo, jobTitle, jobDescription, eligibility, 
            payPackage, bond, bondDescription, formDeadline, registerationLink
        })

        const createdCompany = await Placement.findById(company._id);

        if(!createdCompany){
            throw new apiError(500, "Something went wrong while registration.");
        }

        return res.status(201)
        .json({message: "Company registered successfully!", company: createdCompany});

    } catch (error) {
        throw new apiError(`500`, error?.message || "Internal server error");
    }
}

const getAdminDashboard = async (req, res) => {
    try {
        //check for if admin exists 
    
        if(req.user.role !== "admin") {
            throw new apiError(403, "Unauthorized Admin Access!!!");
        }
        
        const companies = await Placement.find({}).populate("appliedStudents", "name email");

        res.status(200)
        .json({ message: "Admin dashboard loaded successfully" }, companies);
    } catch (error) {
        throw new apiError(`500`, error?.message || "Internal server error");
    }
}


const postAdminDashboard = async (req, res) => {
    if(req.user.role !== "admin") {
        throw new apiError(403, "Unauthorized Admin Access!!!");
    }
    res.status(200).json({ message: "Admin dashboard loaded successfully" });
}

const getStudentDashboard = async (req, res) => {
    try {
        //anyone can access student dashboard if logged in
        const companies = await Placement.find();

        if (!companies || companies.length === 0) {
            return res.status(404).json({ message: "No companies found." });
        }

        return res.status(200).json({ message:"Student Dashboard loaded", companies });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
}


export { registerCompany, getAdminDashboard, getStudentDashboard };
