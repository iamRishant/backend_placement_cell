import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";

const registerUser= (req, res, next)=>{
    // res.json({message:"OK"})
    Promise.resolve()
    .then( async() => 
    {
        const {email, password, name, role} = req.body;
        
        // to do in the following steps, 
        // confirm null fields first
        
        if([email, password, name, role].some((field) => field?.trim() === "")){
            throw new apiError(400, "All fields are required.");
        }

        // check if user already exists or not
        if(await User.findOne({email})){
            throw new apiError(409, "User already exists.");
        }

        //checks for the resume file
        const resumeFileLocation = req.files?.resume[0]?.path;
        
        if(!resumeFileLocation){
            throw new apiError(400, "Resume file is required.");
        }

        const resume = await uploadeOnCloudinary(resumeFileLocation);
        
        //create the mongo user object
        const user = await User.create({
            email,
            password, 
            name, 
            role, 
            resume: resume.url
        })

        //to return the user object without password
        const createdUser = await User.findById(user._id).select("-password");

        if(!createdUser){
            throw new apiError(500, "Something went wrong while registeration.");
        }

        return res.status(201).json({message: "User registered successfully!", user: createdUser});
    })  
    .catch((error) => next(error)) 
}


// Login admin code

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            throw new apiError(400, "Email and password are required");
        }

        // Check if user exists and is an admin
        const admin = await User.findOne({ email, role: "admin" });
        if (!admin) {
            throw new apiError(404, "Admin not found or unauthorized");
        }

        // Verify password
        const isMatch = await admin.isPasswordCorrect(password);
        if (!isMatch) {
            throw new apiError(401, "Invalid credentials");
        }

        // Generate JWT token
        const token = admin.generateAccessToken();

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        throw new apiError(500, error.message);
    }
};

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

        res.status(200).json({ message: "Login successful", token, role: user.role });
    } catch (error) {
        throw new apiError(500, error.message);
    }
};

export  {loginAdmin,loginUser,registerUser};