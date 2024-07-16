const User=require('../../Model/userModel');
const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const Category=require('../../Model/categoryModel')





const loadHome=async (req,res)=>{
    try {


        const userId=req.session.userData
        const findUser= await User.findById(userId)
        const category=await Category.find()
        // console.log(category,'Categories from index');

        // console.log("user find from session:",findUser)
       
        res.render('index',{findUser,categories:category})
    } catch (error) {
        console.log(error.message);
    }
}


const loadRegister=async(req,res)=>{
    try {
        res.render('userRegister')
    } catch (error) {
        console.log(error.message);
    }
}

//register new user
const insertUser=async (req,res)=>{
try {
    const matchEmail=await User.findOne({email:req.body.email});

    if(matchEmail){
        res.render('userRegister',{message:'Already have an account please login'})
    }
    if(req.body.password===req.body.cpassword){
        const thisIsRegisterData={
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            mobile:req.body.mobile,
        };
        req.session.data=thisIsRegisterData;
        // console.log("send")
        res.redirect('/otpGet');
    }
} catch (error) {
    console.log(error.message)
    
}
}; 





const otpGet = async (req, res) => {
    try {
        console.log("Generating OTP...");

        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.EMAIL,// email in env file
                pass: process.env.PASSKEY // passkey also
            }
        });

        // Generating OTP
        let randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
        req.session.otp = randomOtp;

        console.log(req.session.otp, 'this is the OTP');

        const { email, name } = req.session.data;
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: `Hello ${name}`,
            text: `Your verification OTP is ${randomOtp}`
        };

        // Send email 
        try {
            let info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
            res.render('userOtp', { message: '' }); 
        } catch (error) {
            console.log('Error sending email: ' + error);
            res.status(500).send('Error sending email'); 
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
};










//============================= otpVerification



const verifyOtp = async (req, res) => {
    console.log('verifyOtp worked');
    try {
        let otp = req.body.otp;
        
        console.log('verifyOtp worked', otp);
        console.log('verifyOtp worked', req.session.otp);
        if (req.session.otp === otp) {
            console.log(req.body.otp, 'this is the otp from body');
            const { email, name, mobile, password } = req.session.data;
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                name: name,
                email: email,
                mobile: mobile,
                password: hashedPassword,
            });
            const userData = await user.save();
            if (userData) {
                req.session.user = userData._id;
                res.render('userLogin');
            } else {
                res.render('userOtp', { message: 'OTP is incorrect  please try again' });
            }
        } else {
            res.render('userOtp', { message: 'Invalid Otp please enter valid Otp' });
        }
    } catch (error) {
        console.log(error.message);
        res.render('userRegister', { message: 'Server Error' });
    }
};







const loadLogin= async (req,res)=>{
    try {
        res.render('userLogin')
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async (req, res) => {
    // console.log('verify login worked');
    try {
        const { email, password } = req.body;
        // console.log(email, password, "email and password");
        const userData = await User.findOne({ email: email });
        // console.log(userData);


        if(userData){
            const passwordMatch=await bcrypt.compare(password,userData.password)
            if(passwordMatch){
                if(userData.is_active){
                    //Admin Login
                    if(userData.is_admin==1){
                        req.session.admin=userData._id;
                        res.redirect('/admin/adminHome')
                        
    
                    }else{
    
                        req.session.userData=userData._id;
                        res.redirect('/')
                    }
            }else{
                res.render('userLogin',{message:"user not active"})
            }
           
            
            }else{
            res.render('userLogin',{message:'Incorrect email or adderess'})
            }
         }else{
            res.render('userLogin',{message:'you have no account please registe'})
    }

    } catch (error) {
        console.log(error.message);
        res.render('userLogin', { message: "Login failed " });
    }
};


const userLogOut = async (req, res) => {
    try {
        console.log("Im in userLogout");
        req.session.destroy(err => {
            if (err) {
                console.log(err.message);
                return res.status(500).send("Unable to log out");
            }
            res.redirect('/');
        });
    } catch (error) {
        console.log(error.message);
    }
};











const verifyEmail=async (req,res)=>{
    try {
        res.render('emailVerify')
    } catch (error) {
        console.log(error.message);
    }
}

const resetPassword =async (req,res)=>{
    try {
        const matchEmail=await User.findOne({email:req.body.email})
        if(matchEmail){
            req.session.email=req.body.email
            res.redirect('/userNewOtp')
        }else{
         
            res.render('emailVerify',{message:'You have no account please register'})
        }
       
        
    } catch (error) {
        console.log(error.message);
    }
}



const resetPasswordOtp = async (req, res) => {
    try {
        console.log("Generating OTP...");

        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.EMAIL,// email in env file
                pass: process.env.PASSKEY // passkey also
            }
        });

        const userData= await User.findOne({email:req.session.email})

        // Generating OTP
        let randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
        req.session.resetPOtp = randomOtp;

        console.log(req.session.resetPOtp, 'this is the reset password OTP');

        
        const resetPasswordOptions = {
            from: process.env.EMAIL,
            to: req.session.email,
            subject: `Hello ${userData.name}`,
            text: `Your forgot password verifying OTP is ${randomOtp}`

            
        };
        console.log('this part is working or not');

        // Send email 
        try {
            let info = await transporter.sendMail(resetPasswordOptions);
            console.log('Email sent: ' + info.response);
            res.render('passwordOtp', { message: '' }); 
        } catch (error) {
            console.log('Error sending email: ' + error);
            res.status(500).send('Error sending email'); 
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send('otp Server Error');
    }
};

const verifyResetOtp=async (req,res)=>{
    try {
        let resetOtp=req.body.otp;
        if(req.session.resetPOtp===resetOtp){
            res.render('resetPassword')
        }else{
            
            res.render('passwordOtp',{message:"please enter valid email"})
        }


        
    } catch (error) {
        console.log(error.message)
        
    }
}


const savePassword=async (req,res)=>{
    try {

        if(req.body.password===req.body.cpassword){
            let newPassword=req.body.password
         let userData=await User.findOne({email:req.session.email})
         hashedPassword=await bcrypt.hash(newPassword,10)

            userData.password=hashedPassword
            await userData.save()
            res.redirect('/userLogin')

        }
        
    } catch (error) {
        console.log(error.message)
    }
}















//checking
const checking=async (req,res)=>{
    try {
        res.render('shopping-cart')
    } catch (error) {
        console.log(error);
    }
}




module.exports={
    loadHome,
    loadRegister,
    insertUser,
    loadLogin,
    verifyLogin,
    otpGet,
    verifyOtp,
    userLogOut,
    checking,
    verifyEmail,
   resetPassword,
   resetPasswordOtp,
   verifyResetOtp,
   savePassword,


  
}