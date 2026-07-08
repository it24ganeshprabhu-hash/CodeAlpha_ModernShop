const CartModel = require("../models/CartModel");
const InventoryModel = require("../models/InventoryModel");
const { ObjectId } = require("mongodb");

const AddToCart = async (req,res)=>{
    let {userId, productId, quantity}= req.body;
    let product = await InventoryModel.GetProductById(productId);
    if(!product || product.stock < quantity){
        return res.status(400).json({message:"Product not avaliable or not enough stock"});

    }
    const cartItem = {
        productId: new ObjectId(productId),
        name: product.name,
        price: product.price,
        quantity: parseInt(quantity)
    };
        CartModel.AddToCart(userId, cartItem, res);
}

let GetCartItems = async (req,res)=>{
    let {userId}= req.body;
    const items = await CartModel.GetCartItems(userId);
    if (items === null) return res.status(500).json({ message: "Error retrieving cart items" });
    return res.status(200).json({ message: "Cart Items retrieved successfully", data: items });
}

let RemoveFromCart = async (req,res)=>{
    let {userId, productId}= req.body;
    CartModel.RemoveFromCart(userId, productId, res);
}

module.exports = {AddToCart, GetCartItems, RemoveFromCart};