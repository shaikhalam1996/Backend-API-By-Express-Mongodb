const router = require('express').Router();
const registerController = require('../controllers/registrationController')
const getAllUserInfoController = require('../controllers/getAllUserController')
const checkAuthUser = require('../middleware/checkUserAuth')

//First Ways to call middleware
router.use('/changepassword', checkAuthUser)
router.use('/loggedUser', checkAuthUser)

// Private Route
router.get('/',getAllUserInfoController.getAllUser)

router.post('/registration', registerController.registerUser)

router.post('/login', registerController.loginUser)

router.post('/send-reset-password-email', registerController.sendResetPasswordEmail)

router.post('/reset-password/:id/:token', registerController.resetPassword)



// Protected Route 
router.post('/changepassword',registerController.changePassword)
router.get('/loggedUser',registerController.getLoggedUser)


//Second Ways to call middleware
// router.post('/changepassword',checkAuthUser, registerController.changePassword)


module.exports = router;