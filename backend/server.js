const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
let express = require("express");
let cors = require("cors");
let userRoutes = require("./routes/UserRoutes");
let inventoryRoutes = require("./routes/InventoryRoutes");
let orderRoutes = require("./routes/OrderRoutes");
const { Client } = require("./models/UserModel");
let app = express();
app.use(cors());
app.use(express.json());
app.use("/",userRoutes);
app.use("/inventory",inventoryRoutes);
app.use("/order", orderRoutes);

let PORT = process.env.PORT || 9000;
process.on('SIGINT', async () => {
    await Client.close();
    console.log("MongoDB connection closed safely.");
    process.exit(0);
});
app.listen(PORT,()=>{
    console.log("Server is running on port: "+PORT);
})
