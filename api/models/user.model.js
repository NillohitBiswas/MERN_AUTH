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
    profilePicture: {
        type: String,
        default: 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
    },  
    tracks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track'
      }],
} ,
{timestamps: true});

const User = mongoose.model('User',userschema);
export default User;