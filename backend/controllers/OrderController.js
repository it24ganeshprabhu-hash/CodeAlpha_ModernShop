const OrderModel = require("../models/OrderModel");
const InventoryModel = require("../models/InventoryModel");
const CartModel = require("../models/CartModel");
const { calculateTotal } = require("../utils/util");

const PlaceOrder = async (req, res) => {
    const { userId } = req.body;

    const cartItems = await CartModel.GetCartItems(userId);

    if (!cartItems || !Array.isArray(cartItems)) return res.status(500).json({ message: "Error retrieving cart items" });

    if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
    }

    for (const item of cartItems) {
        const product = await InventoryModel.GetProductById(item.productId);
        if (!product) return; 
        
        if (product.stock < item.quantity) {
            return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
        }
        
        const updated = await InventoryModel.UpdateProduct(item.productId, { $inc: { stock: -item.quantity } });
        if (!updated) return res.status(500).json({ message: `Failed to update stock for ${item.name}` });
    }

    const orderData = {
        userId,
        items: cartItems,
        total: calculateTotal(cartItems),
        createdAt: new Date()
    };
    const orderCreated = await OrderModel.CreateOrder(orderData, res);
    if (!orderCreated) return; 

    const cartCleared = await OrderModel.ClearCart(userId, res);
    if (!cartCleared) return; 

    res.status(200).json({ message: "Order completed successfully" });
};

module.exports = { PlaceOrder };