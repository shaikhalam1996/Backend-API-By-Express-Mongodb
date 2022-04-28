const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    email:{
        required:true,
        type:String,
        unique:true
    },
    mobile:{
        required:true,
        type:Number,
        unique:true
    },
    password:{
        required:true,
        type:String,
    },
    tc:{
        required:true,
        type:Boolean,
    }
})

const UserModel = mongoose.model("user",userSchema);

module.exports = UserModel