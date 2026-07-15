const OrderModel = require("../models/OrderModel");
const InventoryModel = require("../models/InventoryModel");
const CartModel = require("../models/CartModel");
const { calculateTotal } = require("../utils/util");

const PlaceOrder = async (req, res) => {
    const userId = req.user.id;

    const cartItems = await CartModel.GetCartItems(userId);

    if (!cartItems || !Array.isArray(cartItems)) return res.status(500).json({ message: "Error retrieving cart items" });


    for (const item of cartItems) {
        const product = await InventoryModel.GetProductById(item.productId);
        if (!product) return res.status(404).json({ message: `Product not found` }); 
        
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
    if (!orderCreated) return res.status(500).json({ message: "Failed to create order" }); 

    const cartCleared = await OrderModel.ClearCart(userId, res);
    if (!cartCleared) return res.status(500).json({ message: "Failed to clear cart" });

    res.status(200).json({ message: "Order completed successfully" });
};

module.exports = { PlaceOrder };