let {MongoClient , ObjectId, ClientEncryption} = require("mongodb");
const bcrypt = require("bcrypt");
let url = process.env.MONGO_URI;

let Client = new MongoClient(url);

let RegisterUser = async (customer, res) => {
    let db = Client.db("modernshop_db");
    let collection = db.collection("customer_data");

    try {
        const existingUser = await collection.findOne({ 
            $or: [{ username: customer.username }, { email: customer.email }] 
        });

        if (existingUser) {
            return res.status(409).json({ message: "Username or Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(customer.password, 10);
        
        customer.password = hashedPassword;

        const result = await collection.insertOne(customer);
        res.status(200).json({ message: "User Registered Successfully" });
        
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ message: "Error in Registering User", details: err.message });
    }
}

let LoginUser = async (req, res) => {
    let db = Client.db("modernshop_db");
    let collection = db.collection("customer_data");

    try {
        const user = await collection.findOne({ username: req.body.username });

        if (!user) {
            return res.status(401).json({ message: "Invalid Username or Password" });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (isMatch) {
            res.status(200).json({ message: "User Logged In Successfully"});
        } else {
            res.status(401).json({ message: "Invalid Username or Password" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error in logging in User" , details: err.message});
    }
}
let AddToCart = async (cartItem, res) => {
    let db = Client.db("modernshop_db");
    let collection = db.collection("cart_data");

    try {
        let { userId, productId, name, price, quantity } = cartItem;
        const existingItem = await collection.findOne({
            userId: new ObjectId(userId),
            "items.productId": productId
        });
        if (existingItem) {
            await collection.updateOne(
                { userId: new ObjectId(userId), "items.productId": productId },
                { $inc: { "items.$.quantity": quantity } }
            );
            res.status(200).json({ message: "Quantity updated!" });
        } 
        else {
            await collection.updateOne(
                { userId: new ObjectId(userId) },
                { $push: { items: { productId, name, price, quantity } } },
                { upsert: true }
            );
            res.status(200).json({ message: "Item added to cart!" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating cart", details: err.message });
    }
}
 
let RemoveFromCart = async (userId, productId, res)=>{
    let db = Client.db("modernshop_db");
    let collection = db.collection("cart_data");
    try{
        const result = await collection.updateOne(
            {userId: new ObjectId(userId)},
            {$pull:{
                items:{productId:productId}
            }}
        )

        if(result.modifiedCount > 0){
            res.status(200).json({message:"Item removed from cart!"});
        }
        else{
            res.status(404).json({message:"Item not found in cart!"});
        }

    }
    catch(err){
        res.status(500).json({messsage:"Error removing item from cart", details:err.message});
    }
}

module.exports = {RegisterUser,LoginUser,AddToCart,RemoveFromCart,Client};

