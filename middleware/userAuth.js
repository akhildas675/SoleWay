const isLogin = async (req,res,next)=>{
    try{
        console.log("inside auth");
        if(req.session.userDat){
           
            next()
        }
        else{
            res.redirect('/userLogin')
            
        }

    } catch (error){
        console.log(error.message);
    }
}


const isLogOut = async (req,res,next)=>{
    try{
    
        if(req.session.userData){
            res.redirect("/")

        }else{
            // console.log("login")
            // res.redirect('/login')
            next()
        }
       

    } catch (error){
        console.log(error.message);
    }
}





module.exports ={
    isLogin,
    isLogOut,
}