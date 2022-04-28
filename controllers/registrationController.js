require('../config/db');
const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../config/emailConfig');
require('dotenv').config();
const registerUser = async (req,res) =>{
    let name = req.body.name
    let email = req.body.email
    let mobile = req.body.mobile
    let password = req.body.password
  
        try {
            if(name && email && mobile && password){

                const emailSearch = await UserModel.findOne({email:email})
                if(emailSearch){
                    res.send({status:'Failed',message:"Email Already Exists"})
                }else{
                    let salt = await bcrypt.genSalt(12);
                    let hashPassword = await bcrypt.hash(password,salt);
                    const data = new UserModel({
                        name:name,
                        email:email,
                        mobile:mobile,
                        password:hashPassword,
                        tc:true
                    });
            
                    await data.save();

                    const saved_user = await UserModel.findOne({email:email})

                    //Generate JWT Token
                    const token = jwt.sign({userId:saved_user._id},process.env.JWT_SECRET_KEY,{expiresIn:'1d'})

                    res.send({status:'Success',message:"Data SuccessFully Stored",token:token})
                }
            }else{
                res.send({status:'Failed',message:"All Fields Are Required"})
            }
        } catch (error) {
            console.log(error)
        }
}

const loginUser = async (req,res) =>{
    let email = req.body.email
    let password = req.body.password

    if(email && password){
        const userEmail = await UserModel.findOne({email:email});
        if(!userEmail){
            res.send({status:'Failed',message:"Email And Password Are Not Exists"})
        }else{
            const isMatch = await bcrypt.compare(password,userEmail.password);
            if(isMatch){
                  //Generate JWT Token
                  const token = jwt.sign({userId:userEmail._id},process.env.JWT_SECRET_KEY,{expiresIn:'1d'})

                res.send({status:'Success',message:"Login SuccessFul",token:token})
            }else{
                res.send({status:'Failed',message:"Email And Password Are Not Valid"})
            }
        }
    }else{
        res.send({status:'Failed',message:"All Fields Are Required"})
    }
}

const changePassword = async(req,res) => {
    let password = req.body.password;
    let confirmpassword = req.body.confirmpassword

    if(password && confirmpassword){
        if(password === confirmpassword){
            let salt = await bcrypt.genSalt(12);
            let newHashPassword = await bcrypt.hash(password,salt);
            // console.log(req.user._id.toString())

            await UserModel.findByIdAndUpdate({_id:req.user._id},{password:newHashPassword})
            
            res.send({status:'Success',message:"Password Updated Successfully"});
        }else{
            res.send({status:'Failed',message:"Password And Confirm Password Does Not Match"});
        }
    }else{
        res.send({status:'Failed',message:"All Fields Are Required"})
    }
}

const getLoggedUser = async(req,res) =>{
    // console.log(req.user)
    res.send({status:'Success',message:[req.user]});
}

const sendResetPasswordEmail = async (req,res) =>{
    let email = req.body.email;
    if(email){
        const userEmail = await UserModel.findOne({email:email});
        if(!userEmail){
            res.send({status:'Failed',message:"Email Is Not Exists"})
        }else{
            const secret = userEmail._id + process.env.JWT_SECRET_KEY;

            const token = jwt.sign({userId:userEmail._id},secret,{expiresIn:'15m'});

            const link = `http://localhost:3000/api/user/${userEmail._id}/${token}`;

            //Send MAil CODE
            let info = await transporter.sendMail({
                from:process.env.EMAIL_FROM,
                to:userEmail.email,
                subject:'Reset Password Email From NodeMailer',
                html:`<a href=${link}>Click Here</a> to Reset Password`
            })
            res.send({status:'Success',message:"Password Reset Email Sent Please Check Your Mail....",info:info});
        }
    }else{
        res.send({status:'Failed',message:"Email Fields Are Required"})
    }

}

const resetPassword = async (req,res) =>{
    let password = req.body.password;
    let confirmpassword = req.body.confirmpassword

    let {id,token} = req.params

    const user = await UserModel.findById(id);

    // console.log(user)

    const new_secret = user._id + process.env.JWT_SECRET_KEY;

    // console.log(new_secret)

    try {
        jwt.verify(token,new_secret);
        if(password && confirmpassword){
            if(password === confirmpassword){
                let salt = await bcrypt.genSalt(12);
                let newHashPassword = await bcrypt.hash(password,salt);

                await UserModel.findByIdAndUpdate({_id:user._id},{password:newHashPassword})
                
                res.send({status:'Success',message:"Password Updated Successfully"});
            }else{
                res.send({status:'Failed',message:"Password And Confirm Password Does Not Match"});
            }
        }else{
            res.send({status:'Failed',message:"All Fields Are Required"})
        }
    } catch (error) {
        console.log(error)
    }

}

module.exports = {
    registerUser,
    loginUser,
    changePassword,
    getLoggedUser,
    sendResetPasswordEmail,
    resetPassword
}