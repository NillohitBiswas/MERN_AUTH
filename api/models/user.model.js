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
    profilepicture: {
        type: String,
        default: "https://www.google.com/imgres?q=profile%20image&imgurl=https%3A%2F%2Fthumbs.dreamstime.com%2Fb%2Fbusinessman-avatar-image-beard-hairstyle-male-profile-vector-illustration-178545831.jpg&imgrefurl=https%3A%2F%2Fwww.dreamstime.com%2Fbusinessman-avatar-image-beard-hairstyle-male-profile-vector-illustration-image178545831&docid=YU5fB0LnOc9EYM&tbnid=bGD1ZQ9uFS6CRM&vet=12ahUKEwivl4-ewcKHAxXjh1YBHRFPDJo4ChAzegQIRBAA..i&w=800&h=800&hcb=2&ved=2ahUKEwivl4-ewcKHAxXjh1YBHRFPDJo4ChAzegQIRBAA"
    },


}, {timestamps: true});

const User = mongoose.model('User',userschema);
export default User;