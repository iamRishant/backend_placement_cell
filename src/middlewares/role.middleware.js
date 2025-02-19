export const verifyRoles = (role) => {
    return (req, res, next) => {
        if(req.user.role !== "admin"){
            return res.status(403).json({message: "Access Denied!!!"});
        }
        next();
    }
}