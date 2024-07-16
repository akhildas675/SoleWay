//module require

const express=require('express');
const adminRoute = express()
const adminController=require('../Controller/admin/adminController')
const path=require('path')
const Auth=require('../middleware/adminAuth')
const categoryController=require('../Controller/admin/categoryController')
const productController=require('../Controller/admin/productController')
const multerImage=require('../config/multer')
const multer=require('multer')

//-----------------------------------

adminRoute.use(express.static('public'))
adminRoute.use(express.static(path.join(__dirname, '..', 'public', 'admin-assets')))
adminRoute.set('view engine','ejs')
adminRoute.set('views','./views/admin')




//Admin controller

adminRoute.get('/adminHome',Auth.isLogin,adminController.adminLoad)
adminRoute.get('/adminLogout',Auth.isLogin,adminController.adminLogout)

//user Management

adminRoute.get('/usersView',Auth.isLogin,adminController.loadUsers)
adminRoute.get('/blockUser',Auth.isLogin,adminController.userBlocking)
adminRoute.get('/unBlockUser',Auth.isLogin,adminController.userUnblocking)

//Category Controller

adminRoute.get('/categoryAdd',Auth.isLogin,categoryController.categoryPage)
adminRoute.post('/addingCategory',Auth.isLogin,categoryController.categoryAdding)
adminRoute.get('/categoryBlock',Auth.isLogin,categoryController.categoryBlocking)
adminRoute.get('/categoryUnblock',Auth.isLogin,categoryController.categoryUnblocking)
adminRoute.get('/categoryEdit',Auth.isLogin,categoryController.editCategory)
adminRoute.post('/editCategory',Auth.isLogin,categoryController.editingCategory)

//productController

adminRoute.get('/productsView',Auth.isLogin,productController.productPage)
adminRoute.get('/productAdd',Auth.isLogin,productController.addProduct)
adminRoute.post('/createProduct', multerImage.upload.array('images', 5), Auth.isLogin, productController.productVerify);











// adminRoute.get('/find',productController.findThePage)





module.exports=adminRoute;