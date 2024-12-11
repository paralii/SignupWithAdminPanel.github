const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength: [3, "Name must be at least 3 characters"],
        unique:true
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'] 
    },
    password:{
        type:String,
        required:true,
        minlength: [8, "Password must be at least 8 characters"]
    }
});

const User = new mongoose.model("users", userSchema);

module.exports = User;