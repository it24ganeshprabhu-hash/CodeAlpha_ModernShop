require("dotenv").config();
let express = require("express");
let cors = require("cors");
let UserRoutes = require("./routes/UserRoutes");
let InventoryRoutes = require("./routes/InventoryRoutes");
const { Client } = require("./models/UserModel");
let app = express();
app.use(cors());
app.use(express.json());
app.use("/",UserRoutes);
app.use("/inventory",InventoryRoutes);

let PORT = process.env.PORT || 9000;
process.on('SIGINT', async () => {
    await Client.close();
    console.log("MongoDB connection closed safely.");
    process.exit(0);
});
app.listen(PORT,()=>{
    console.log("Server is running on port: "+PORT);
})
