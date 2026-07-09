let {MongoClient , ObjectId, ClientEncryption} = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_super_secret_key";
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
            const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: "Login successful", token: token });
        } else {
            res.status(401).json({ message: "Invalid Username or Password" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error in logging in User" , details: err.message});
    }
}


module.exports = {RegisterUser,LoginUser,Client};

