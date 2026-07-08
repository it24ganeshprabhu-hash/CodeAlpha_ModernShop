const { ObjectId } = require("mongodb");
const { Client } = require("./UserModel");

const CreateOrder = async (orderData, res) => {
    try {
        let db = Client.db("modernshop_db");
        await db.collection("orders_data").insertOne(orderData);
        return true; 
    } 
    catch (err) {
        res.status(500).json({ message: "Order failed to create.", details: err.message });
        return false; 
    }
};

const ClearCart = async (userId, res) => {
    try {
        let db = Client.db("modernshop_db");
        await db.collection("carts").updateOne(
            { userId: new ObjectId(userId) },
            { $set: { items: [] } }
        );
        return true;
    } catch (err) {
        res.status(500).json({ message: "Error in clearing the cart.", details: err.message });
        return false;
    }
};

module.exports = { CreateOrder, ClearCart };