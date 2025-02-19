import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";

export const verifyJWT = async (req, __, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");

        if(!token){
            throw new apiError(401, "Unauthorized access!!!");
        }

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodeToken?._id).select("-password");
        
        if(!user){
            throw new apiError(401, "Ivalid Access Token!!!");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new apiError(401, error?.message || "Unauthorized access!!!");
    }
}