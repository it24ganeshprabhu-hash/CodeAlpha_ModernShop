let InventoryModel = require("../models/InventoryModel");

let AddItem = (req,res)=>{
    let product = {
        name: req.body.name,           
        price: parseFloat(req.body.price), 
        stock: parseInt(req.body.stock),   
        category: req.body.category,       
        description: req.body.description, 
        sku: req.body.sku,                 
        imageUrl: req.body.imageUrl,       
        createdAt: new Date()
    }
    InventoryModel.AddProduct(product,res);
}

let GetAllItems = (req,res)=>{
    InventoryModel.GetAllProducts(res);
}

let UpdateItem = (req,res)=>{
    let productId = req.params.productId;
    let updatedData = req.body; 
    InventoryModel.UpdateProduct(productId, updatedData, res);
}

module.exports = {AddItem,GetAllItems,UpdateItem};