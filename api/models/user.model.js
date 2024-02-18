import mongoose from "mongoose";

const userschema= new mongoose.Schema({
    username:{
        type :String,
        required:true,
        unique: true,
    },
    email:{
        type :String,
        required:true,
        unique: true,
    },
    password:{
        type :String,
        required:true,
    },
    dateofbirth:{
        type :String,
        required:true,
    }
}, {timestamps: true});

const User = mongoose.model('User',userschema);
export default User;