// here we will only create two apis which are update user details and get user details

import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const getCurrentUser=async (req,res)=>{

    //we will run an middleware on the route so we will have the user object in req object
    res.status(200).json({
        status: 200,
        user: req.user,
        message: "Current User Fetched Successfully"
    });
}

const updateResume=async(req,res)=>{

    //req.file we will get from multer middleware
    //taking file and uploading it on cloudinary
    try {
        const resumeLocalPath = req.files?.resume[0]?.path;
    
        if(!resumeLocalPath){
            throw new apiError(400,"File is missing")
        }
        const uploaded=await uploadOnCloudinary(resumeLocalPath)
    
        if(!uploaded.url){
            throw new apiError(400,"Error while uploading on cloudinary")
        }
    
        // after upload update the database
    
        const updatedUser=await User.findByIdAndUpdate(req.user._id,
            {
                $set:{
                    resume:uploaded.url
                }
        },
        {new:true}
        ).select("-password")
    
        return res.status(201)
        .json({message: "Resume Updated Successfully!", user: updatedUser});
    }
    catch (error) {
        throw new apiError("Error while updating resume")
    }
}

const updateUserDetails=async (req,res)=>{
    
}
const updatePassword=async(req,res)=>{

}

export {getCurrentUser,updateResume};