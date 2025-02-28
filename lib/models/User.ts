import mongoose from "mongoose";


const userSchema= new mongoose.Schema({

    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user"
    },
    image:{
        type: String
    },

    authProviderId:{
        id:{type: String},
        providerName:{type: String}
        
    },
    gender:{
        type:String,
        enum:["male","female"]
    },

})

export const User=mongoose.models?.User || mongoose.model("User",userSchema);
