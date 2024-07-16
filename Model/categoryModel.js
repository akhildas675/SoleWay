const mongoose=require('mongoose');
const timestamp = require('timestamp');
const categorySchema=mongoose.Schema({
    categoryName:{
        type:String,
        required:true,
    },
    description: {
        type: String,
        required: true
      },
    // date:{
    //     type:Date,
    // },
    is_active:{
        type:Boolean,
        default:true,
    }
},{
    timestamp:true
});

module.exports=mongoose.model('Category',categorySchema)