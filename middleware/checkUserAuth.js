const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const checkAuthUser = async(req,res,next) =>{
    let token;
    const authorization = req.headers;
     // console.log(authorization)
    if(authorization.authorization && authorization.authorization.startsWith('Bearer')){
        try {
            
            token = authorization.authorization.split(" ")[1]
            // console.log(token)

            let user_id = jwt.verify(token,process.env.JWT_SECRET_KEY);

            // console.log(user_id)

            req.user = await UserModel.findById(user_id.userId).select('-password');

            // console.log(req.user)
            next();
             // Second Ways to Get User ID
            // let {userId} = jwt.verify(token,process.env.JWT_SECRET_KEY);
            // console.log(userId)

        } catch (error) {
            console.log(error)
        }
    }else{
        res.send({status:'Failed',message:"Unauthorized Users"});
    }

    // Second Ways to Get Token
    // const {authorization} = req.headers;
    // token = authorization.authorization.split(" ")[1]
    
}


// const userLoggedToken = async(req,res,next) =>{
//     let token;
//     const authorization = req.headers;
//      // console.log(authorization)
//     if(authorization.authorization && authorization.authorization.startsWith('Bearer')){
//         try {
            
//             token = authorization.authorization.split(" ")[1]
//             // console.log(token)

//             req.token = token;

//             // console.log(user_id)

//             // req.user = await UserModel.findById(user_id.userId).select('-password');

//             // console.log(req.user)
//             next();

//         } catch (error) {
//             console.log(error)
//         }
//     }else{
//         res.send({status:'Failed',message:"Unauthorized Users"});
//     }
    
// }

module.exports = {
    checkAuthUser
    // userLoggedToken
};