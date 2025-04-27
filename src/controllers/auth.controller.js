import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import uploadOnCloudinary from '../utils/cloudinary.js'
import { Otp } from "../models/otp.model.js";

const registerUser= async (req, res)=>{
    // res.json({message:"OK"})
    try{
        const {email, password, name, role} = req.body;
        
        // to do in the following steps, 
        // confirm null fields first
        
        const verification = await Otp.findOne({email});
        if(!verification || verification?.verified === false){
            throw new apiError(403, "Email not verified. Please verify your email first.");
        }

        if(
            [email, password, name, role].some((field) => field?.trim() === "")
        ){
            throw new apiError(400, "All fields are required.");
        }
  
        if(role === "admin"){
            throw new apiError(403, "Unauthorized to register as admin.");
        }

        // check if user already exists or not
        const existedUser = await User.findOne({email});
        if(existedUser){
            throw new apiError(409, "User already exists.");
        }

        //checks for the resume file
        const resumeFileLocation = req.files?.resume[0]?.path;
        
        if(!resumeFileLocation){
            throw new apiError(400, "Resume file is required.");
        }

        const resume = await uploadOnCloudinary(resumeFileLocation);
        if(!resume) throw new apiError(500,"Error while uploading resume")
        
        //create the mongo user object
        const user = await User.create({
            email,
            password, 
            name, 
            role, 
            resume: resume?.url
        })

        //to return the user object without password
        const createdUser = await User.findById(user._id).select("-password");

        if(!createdUser){
            throw new apiError(500, "Something went wrong while registration.");
        }
        await Otp.deleteOne({email});

        return res.status(201).json({message: "User registered successfully!", user: createdUser});
    }catch(error){ 
        throw new apiError(500, error?.message || "Internal server error")
    };
}


// Login admin code 

// const loginAdmin = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Validate input
//         if (!email || !password) {
//             throw new apiError(400, "Email and password are required");
//         }

//         // Check if user exists and is an admin
//         const admin = await User.findOne({ email, role: "admin" });
//         if (!admin) {
//             throw new apiError(404, "Admin not found or unauthorized");
//         }

//         // Verify password
//         const isMatch = await admin.isPasswordCorrect(password);
//         if (!isMatch) {
//             throw new apiError(401, "Invalid credentials");
//         }

//         // Generate JWT token
//         const token = admin.generateAccessToken();

//         res.status(200).json({ message: "Login successful", token });
//     } catch (error) {
//         throw new apiError(500, error.message);
//     }
// };

// Login user code

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            throw new apiError(400, "Email and password are required");
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            throw new apiError(404, "User not found");
        }

        // Verify password
        const isMatch = await user.isPasswordCorrect(password);
        if (!isMatch) {
            throw new apiError(401, "Invalid credentials");
        }

        // Generate JWT token
        const token = user.generateAccessToken();
        const loggedInUser = await User.findById(user._id).select("-password");

        //allows secure transfer of cookies, and only accessible by the server only
        const options = {
            httpOnly: true, 
            secure: true
        }

        return res.status(200)
        .cookie("token", token, options)
        .json({ message: "User Login successful", token, user: loggedInUser });
    } catch (error) {
        throw new apiError(500, error.message);
    }
};

const logoutUser = async (_, res) => {
    try {
        const options = {
            httpOnly: true, 
            secure: true
        }
    
        return res.status(200)
        .clearCookie("token", options)
        .json({ message: "User Logout successful" });
        //local storage token & user detail deletion is done by front end
    } catch (error) {
        throw new apiError(500, error.message);
    }
}

export { registerUser, loginUser, logoutUser };