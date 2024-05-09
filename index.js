const port= 4000;
const express=require("express");
const app= express();
const mongoose=require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
//const { type } = require("os");
app.use(express.json());
app.use(cors());
//Database ConnectionWith Mongodb
mongoose.connect("mongodb+srv://aswikavg21msc:aswika61@cluster0.njjgpbh.mongodb.net/sjJewellers");
//API Creation
app.get("/",(req,res)=>{
    res.send("Express App is Running")
})
app.listen(port,(error)=>{
    if(!error){
        console.log("Server Running on Port"+port)
    }
    else{
        console.log("Error :"+error)
    }
})
//Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
      return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload= multer({storage:storage})
//Creating Upload Endpoint for images
app.use('/images',express.static('upload/images'))
app.post("/upload",upload.single('product'),(req,res)=>{
        res.json({
            success:1,
            image_url:`http://localhost:${port}/images/${req.file.filename}`
        })

})

//Schema

const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    type: {
        type: String,  // Make sure the type is defined as String
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
}, "products");

app.post('/addproduct',async (req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0)
    {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id=last_product.id+1;
    }
    else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        type:req.body.type,
        price:req.body.price,
    }) ;
    console.log(product);
    await product.save();
    console.log("Product Details Saved Successfully");
    res.json({
        success:true,
        name:req.body.name,
    })
})
// Creaing API For Deleting Products

app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
})

// Creaing API For getting All Products

app.get('/allproducts',async (req,res)=>{
let products = await Product.find({});
console.log("All Products Fetched");
res.send(products);
})

