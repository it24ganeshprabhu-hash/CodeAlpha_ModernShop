let {MongoClient , ObjectId, ClientEncryption} = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_super_secret_key";
let url = process.env.MONGO_URI;

let Client = new MongoClient(url);

let RegisterUser = async (customer, res) => {
    try {
        await Client.connect();
        let db = Client.db("modernshop_db");
        let collection = db.collection("customer_data");

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
    try {
        await Client.connect();
        let db = Client.db("modernshop_db");
        let collection = db.collection("customer_data");

        const user = await collection.findOne({ username: req.body.username });

        if (!user) {
            return res.status(401).json({ message: "Invalid Username or Password" });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: "Login successful", token: token });
        } else {
            res.status(401).json({ message: "Invalid Username or Password" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error in logging in User" , details: err.message});
    }
}

const GetProfile = async (req,res)=>{
    try{
        await Client.connect();
        const db = Client.db("modernshop_db");
        const user = await db.collection("customer_data").findOne(
            {_id: new ObjectId(req.user.id)},
            {projection: {password: 0}}
        )
        res.json(user);
    }
    catch(err){
        res.status(500).json({message: "Error in getting information." , details: err.message});
    }
}

const UpdateProfile = async (userId, updateData, res) => {
    try {
        await Client.connect();
        const db = Client.db("modernshop_db");
        let setClause = { 
            email: updateData.email, 
            phone: updateData.phone, 
            address: updateData.address 
        };
        if (updateData.password && updateData.password.trim() !== "") {
            setClause.password = await bcrypt.hash(updateData.password, 10);
        }
        await db.collection("customer_data").updateOne(
            { _id: new ObjectId(userId) },
            { $set: setClause }
        );
        res.json({ message: "Profile updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Update failed", details: err.message });
    }
};

const GetOrders = async (req, res) => {
    try {
        await Client.connect();
        const db = Client.db("modernshop_db");
        const orders = await db.collection("orders").find({ userId: new ObjectId(req.user.id) }).toArray();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching orders" });
    }
};

module.exports = {RegisterUser,LoginUser,GetOrders,UpdateProfile,GetProfile,Client};

