const Products=require('../../Model/productModel')
const Category=require('../../Model/categoryModel')
const sharp=require('sharp')
const { v4: uuidv4 } = require("uuid")
const fs=require('fs')
const path=require('path')




const productPage=async(req,res)=>{
    try {
        res.render('productsList')
        
    } catch (error) {
        console.log(error);
        
    }
}

const addProduct=async(req,res)=>{
    try {
        const category=await Category.find()
        // console.log(category);
        res.render('addProduct',{categories:category})
        
    } catch (error) {
        console.log(error);
    }
}


const productVerify = async (req, res) => {
    try {
        const { productName, description, realPrice, stock, size, category } = req.body;
        const imagesStore = [];

        // Process uploaded files
        for (const file of req.files) {
            const filename = `${uuidv4()}.jpg`;
            const imagePath = path.join('/admin-assets/uploads', filename);
            const imageOutput = path.join(__dirname, '../public', imagePath);

            
            fs.mkdirSync(path.dirname(imageOutput), { recursive: true });

            
            fs.renameSync(file.path, imageOutput);
            imagesStore.push(imagePath);
        }

        // Create a new products
        const product = new Products({
            productName,
            description,
            size,
            stock,
            realPrice,
            category,
            images: imagesStore 
        });

        const productData = await product.save();
        if (productData) {
            res.render('productsList');
        } else {
            console.log('Error saving product');
            res.status(500).send('Error adding product');
        }

    } catch (error) {
        console.log('Error', error.message);
        res.status(500).send('Internal server error');
    }
};















module.exports={
    addProduct,
    // findThePage,
    productPage,
    addProduct,
    productVerify,

    

}