const isLogin= async (req,res,next)=>{
    try {
        if(req.session.admin){
            next()
        }else{
           // res.redirect('/admin/adminHome')
           res.redirect('/')
        }
        
    } catch (error) {
        console.log(error);
    }
}


const isLogout=async(req,res,next)=>{
    try {
        if(!req.session.admin){
            next()
        }else{
            res.redirect('/admin/adminHome')
        }
    } catch (error) {
        console.log(error)
    }
}


module.exports={
    isLogin,
    isLogout
}