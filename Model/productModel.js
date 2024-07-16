const mongoose=require('mongoose')
const timestamp = require('timestamp')

const productSchema=mongoose.Schema({
    productName:{
        type:String,
        required:true,
    },
    size:{
        type:Number,
        require:true,
    },
    description:{
        type:String,
        required:true,
    },
    realPrice:{
        type:Number,
        required:true,
    },
    // salePrice:{
    //     type:Number,
    //     required:true,
    // },
    stock:{
        type:Number,
        required:true,
    },
    images:{
        type:Array,
        // required:true,
    },
    is_active:{
        type:Boolean,
        default:true,
    },
    created:{
        date:Date,
        // default:Date.now,

    }
},{timestamps:true})


module.exports=mongoose.model('Products',productSchema)