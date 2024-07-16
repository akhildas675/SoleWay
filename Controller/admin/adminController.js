const User=require("../../Model/userModel")


const adminLoad = async(req,res) => {
    try {
        // const user = User.find()
        res.render('dashboard')
    } catch (error) {
        console.log(error);
    }
}

const loadUsers=async(req,res)=>{
    try {
        const userData= await User.find()

        res.render('users',{users:userData})
        
    } catch (error) {
        console.log(error)
        
    }
}


const userBlocking=async (req,res)=>{
    try {
        const userId=req.query.id
    
        // console.log(userId,'This is the user ID')
        const userBlock=await User.findByIdAndUpdate(userId,{is_active:false})
        // console.log(userBlock,'user Blocking')

        res.redirect('/admin/usersView')


        
    } catch (error) {
        console.log(error);
    }
}


const userUnblocking=async (req,res)=>{
    try {
        const userId=req.query.id
        // console.log(userId)
        const userUnBlock=await User.findByIdAndUpdate(userId,{is_active:true})
        // console.log(userUnBlock,'userUnblocking');
        res.redirect('/admin/usersView')
    } catch (error) {
        console.log(error);
    }
} 




const adminLogout=async(req,res)=>{
    try {
        req.session.destroy(err=>{
            if(err){
                console.log(err)
                return res.status(500).send("Unable to log out");
            }
        })
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
}

















module.exports = {
    adminLoad,
    loadUsers,
    adminLogout,
    userBlocking,
    userUnblocking,
   
  
    

}