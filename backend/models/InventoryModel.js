let {MongoClient, ObjectId} = require("mongodb");
const {Client} = require("./UserModel");

let AddProduct = async (product,res)=>{
    let db = Client.db("modernshop_db");
    let collection = db.collection("product_data");

    try{
        let {name, price, stock, category, description, sku, imageUrl} = product;
        const existingProduct = await collection.findOne({
            $or: [
                {name: name},
                {sku: sku}
            ]
        });
        if(existingProduct){
            return res.status(409).json({message:"Product with the same name or SKU already exists"});
        }
        const result = await collection.insertOne(product);
        res.status(200).json({message:"Product added successfully", productId: result.insertedId});
    }
    catch(err){
        res.status(500).json({message:"Error in adding product", details:err.message});
    }
}

let GetAllProducts = async (res)=>{
    let db = Client.db("modernshop_db");
    let collection = db.collection("product_data");
    try{
        const products = await collection.find().toArray();
        res.status(200).json({message:"Products fetched successfully", data: products});
    }
    catch(err){
        res.status(500).json({message:"Error in fetching products", details:err.message});
    }
}

let UpdateProduct = async (productId, updatedData, res)=>{
    let db = Client.db("modernshop_db");
    let collection = db.collection("product_data");
    try{
        const result = await collection.updateOne(
            { _id: new ObjectId(productId) },
            { $set: updatedData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully" });

    }
    catch(err){
        res.status(500).json({message:"Error in updating product", details:err.message});
    }
}
const GetProductById = async (productId) => {
    try {
        const db = Client.db("modernshop_db");
        return await db.collection("product_data").findOne({ _id: new ObjectId(productId) });
    } catch (err) {
        console.error("Error in GetProductById:", err);
        return null;
    }
};

module.exports = {AddProduct,GetAllProducts,UpdateProduct,GetProductById};
