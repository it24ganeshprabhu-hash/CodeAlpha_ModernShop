let InventoryModel = require("../models/InventoryModel");

let AddItem = (req,res)=>{
    let product = {

    }
    InventoryModel.AddProduct(product,res);
}

let GetAllItems = (req,res)=>{
    InventoryModel.GetAllProducts(res);
}

let UpdateItem = (req,res)=>{
    let updatedData = req.body.updatedData;
    InventoryModel.UpdateProduct(req.params.productId, updatedData, res);
}

module.exports = {AddItem,GetAllItems,UpdateItem};