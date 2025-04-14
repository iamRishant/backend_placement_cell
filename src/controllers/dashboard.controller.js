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
        
            console.log(req.body);
        
        if(
            [companyName, companyInfo, jobTitle, eligibility, jobDescription, payPackage, registerationLink].some((field) => (!field || (typeof field === "string" && field.trim() === "")))
        ){  
            throw new apiError(400, "All fields are required.");
        }

        const existedCompany = await Placement.findOne({
            companyName: companyName
        });
        
        if(existedCompany){
            throw new apiError(409, "Company already exists.");
        }

        const company = await Placement.create({
            companyName: companyName,
            companyInfo, jobTitle, jobDescription, eligibility, 
            payPackage, bond, 
            formDeadline: formDeadline? new Date(formDeadline): new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 
            bondDescription: bond? bondDescription:"No bond", 
            registerationLink
        })


        const createdCompany = await Placement.findById(company._id);

        if(!createdCompany){
            throw new apiError(500, "Something went wrong while registration.");
        }

        return res.status(201)
        .json({message: "Company registered successfully!", company: createdCompany});

    } catch (error) {
        throw new apiError(500, error?.message || "Internal server error");
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
        .json({ message: "Admin dashboard loaded successfully",
            companies: companies
        });
    } catch (error) {
        throw new apiError(500, error?.message || "Internal server error");
    }
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
const updateCompany = async (req, res) => {
    //before coming here we have to add verifyJWT middleware so that we can get user info
    //before moving ahead we will check who is trying to update the data( only admin allowed)
    //then we will take updated data and validate it 
    //then we will find the company details on database
    //then update the database and return new data 


    try {
      // Ensure only admin can update
      const user = req.user; // set by verifyJWT middleware
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }
  
      const { id, ...updateData } = req.body;
  
      if (!id) {
        return res.status(400).json({ message: "Company ID is required." });
      }
  
      // Clean bondDescription if bond is false
      if (!updateData.bond) {
        updateData.bondDescription = null;
      }
  
      const updatedCompany = await Placement.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true } // return updated document
      );
  
      if (!updatedCompany) {
        return res.status(404).json({ message: "Company not found." });
      }
  
      res.status(200).json({message:"Company Updated Successfully",updatedCompany});
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ message: "Server error." });
    }
  };


export { registerCompany, getAdminDashboard, getStudentDashboard,updateCompany };
