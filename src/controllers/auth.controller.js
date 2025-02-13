import { User } from "../models/user.model";


const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if user exists and is an admin
        const admin = await User.findOne({ email, role: "admin" });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found or unauthorized" });
        }

        // Verify password
        const isMatch = await admin.isPasswordCorrect(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = admin.generateAccessToken();

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const registerUser= async (req,res)=>{
    res.json({message:"OK"})
    
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify password
        const isMatch = await user.isPasswordCorrect(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = user.generateAccessToken();

        res.status(200).json({ message: "Login successful", token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export  {loginAdmin,loginUser,registerUser};