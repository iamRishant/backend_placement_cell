import mongoose from "mongoose";

const placementSchema = new mongoose.Schema({
    companyName:{
        type: String,
        required: true
    },

    companyInfo:{
        type: String,
        required: true,
    },

    jobTitle:{
        type: String,
        required: true,
    },
    
    jobDescription:{
        type : String,
        required: true
    },

    eligibility: {
        type: String,
        required: true,
    },

    payPackage: {
        type: String,
        required: true,
    },

    bond: {
        type: Boolean,
        required: true,
    },  
    
    bondDescription: {
        type: String,
    },
    
    formDeadline:{
        type: Date, 
    },

    registerationLink: {
        type: String,
        required: true,
    },
    appliedStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, {timestamps: true})

export const Placement = mongoose.model("Placement", placementSchema)