require('../config/db');
const UserModel = require('../models/userModel');

const getAllUser = async (req,res)=>{
    const response = await UserModel.find();
    res.send(response)
}

module.exports = {
    getAllUser
}