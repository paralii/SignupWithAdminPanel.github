const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    adminname:{
        type:String,
        required:true,
        minlength:3,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength: [8, "Password must be at least 8 characters"]
    }
})

const Admin =mongoose.model("admins",adminSchema);

module.exports =Admin;