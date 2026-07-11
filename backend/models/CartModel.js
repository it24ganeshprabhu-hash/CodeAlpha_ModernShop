const { ObjectId } = require("mongodb");
const { Client } = require("./UserModel");

const AddToCart = async (userId, cartItem, res) => {
    let db = Client.db("modernshop_db");
    try {
        const existing = await db.collection("carts").updateOne(
            { userId: new ObjectId(userId), "items.productId": cartItem.productId },
            { $inc: { "items.$.quantity": cartItem.quantity } }
        );

        if (existing.matchedCount === 0) {
            await db.collection("carts").updateOne(
                { userId: new ObjectId(userId) },
                { $push: { items: cartItem } },
                { upsert: true }
            );
        }
        res.status(200).json({ message: "Item added successfully" });
    } catch (err) {
        res.status(500).json({ message: "DB Error", details: err.message });
    }
};

const GetCartItems = async (userId) => {
    let db = Client.db("modernshop_db");
    try {
        const cart = await db.collection("carts").findOne({ userId: new ObjectId(userId) });
        return cart ? cart.items : [];
    } catch (err) {
        return null;
    }
};

const UpdateCartItemQuantity = async (userId, productId, quantityDelta, res) => {
    let db = Client.db("modernshop_db");
    try {
        const cart = await db.collection("carts").findOne({ userId: new ObjectId(userId) });
        const existingItem = cart?.items?.find((item) => String(item.productId) === String(productId));

        if (!existingItem) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        const newQuantity = existingItem.quantity + parseInt(quantityDelta, 10);

        if (newQuantity <= 0) {
            await db.collection("carts").updateOne(
                { userId: new ObjectId(userId) },
                { $pull: { items: { productId: new ObjectId(productId) } } }
            );
            return res.status(200).json({ message: "Item removed from cart" });
        }

        await db.collection("carts").updateOne(
            { userId: new ObjectId(userId), "items.productId": new ObjectId(productId) },
            { $set: { "items.$.quantity": newQuantity } }
        );

        res.status(200).json({ message: "Cart updated", quantity: newQuantity });
    } catch (err) {
        res.status(500).json({ message: "DB Error", details: err.message });
    }
};

const RemoveFromCart = async (userId, productId, res) => {
    let db = Client.db("modernshop_db");
    try {
        await db.collection("carts").updateOne(
            { userId: new ObjectId(userId) },
            { $pull: { items: { productId: new ObjectId(productId) } } }
        );
        res.status(200).json({ message: "Item removed" });
    } catch (err) {
        res.status(500).json({ message: "DB Error", details: err.message });
    }
};

module.exports = { AddToCart, GetCartItems, UpdateCartItemQuantity, RemoveFromCart };