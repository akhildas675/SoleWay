
const express = require('express');
const userRoute = express();
const path = require('path');
const bodyParser=require('body-parser')
const userController=require('../Controller/userController/userController')
const Auth=require('../middleware/userAuth')
const adminAuth=require('../middleware/adminAuth')
// Define your routes here
// userRoute.use()



userRoute.use(express.static('public'))
userRoute.use(express.static(path.join(__dirname, '..', 'public', 'user-assets'))); // Note the use of '..' to go up a directory level
userRoute.set('view engine','ejs');
userRoute.set('views','./views/user')
//userRoute.set('views','./views/admin')


//User Home page
userRoute.get('/',adminAuth.isLogout,userController.loadHome)
userRoute.get('/logOut',userController.userLogOut)




//User registration
userRoute.get('/userRegister',Auth.isLogOut,userController.loadRegister)
userRoute.post('/verifyRegister',Auth.isLogOut,userController.insertUser)
userRoute.get('/userLogin',Auth.isLogOut,adminAuth.isLogout,userController.loadLogin)
userRoute.post('/verifylog',Auth.isLogOut,userController.verifyLogin);
userRoute.get('/otpGet',Auth.isLogOut,userController.otpGet)
userRoute.post('/verifyOtp',Auth.isLogOut,userController.verifyOtp)



//forgetPassword
userRoute.get('/emailVerify',Auth.isLogOut,userController.verifyEmail)
userRoute.post('/existUser',Auth.isLogOut,userController.resetPassword)
userRoute.get('/userNewOtp',Auth.isLogOut,userController.resetPasswordOtp)
userRoute.post('/resetOtp',Auth.isLogOut,userController.verifyResetOtp)
userRoute.post('/postPassword',Auth.isLogOut,savePassword)












//test route

userRoute.get('/check',userController.checking)



// userRoute.get('*',userController.userError)


module.exports = userRoute;
