let {MongoClient, ObjectId} = require("mongodb");
const {Client} = require("./UserModel");

let AddProduct = async (product,res)=>{
    let db = Client.db("modernshop_db");
    let collection = db.collection("product_data");

    try{

    }
    catch(err){
        res.status(500).json({message:"Error in adding product", details:err.message});
    }
}

let GetAllProducts = async (res)=>{
    let db = Client.db("modernshop_db");
    let collection = db.collection("product_data");
    try{

    }
    catch(err){
        res.status(500).json({message:"Error in fetching products", details:err.message});
    }
}

let UpdateProduct = async (productId, updatedData, res)=>{
    let db = Client.db("modernshop_db");
    let collection = db.collection("product_data");
    try{

    }
    catch(err){
        res.status(500).json({message:"Error in updating product", details:err.message});
    }
}

module.exports = {AddProduct,GetAllProducts,UpdateProduct};
