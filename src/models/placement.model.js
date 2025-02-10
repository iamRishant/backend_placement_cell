import mongoose from "mongoose";

const placementSchema = new mongoose.Schema({
    companyName:{
        type: String,
        required: true,
        lowercase: true
    },

    companyInfo:{
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },

    date:{
        type: Date,
        default: Date.now,  
        required: true,
    },
    jobTitle:{
        type: String,
        required: true,
    },
    
    jobDescription: mongoose.Schema.Types.Mixed,

    eligibility: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },

    payPackage: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },

    bond: {
        type: Boolean,
        required: true,
    },  
    
    bondDescription: {
        type: String,
        required: function(){ return this.bond;}
    },
    
    formDeadline:{
        type: Date,
        default: Date.now,
        required: true,
    },

    registerationLink: {
        type: String,
        required: true,
    },
}, {timestamps: true})

export const Placement = mongoose.model("Placement", placementSchema)