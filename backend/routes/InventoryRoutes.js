const express = require("express");
const InventoryController = require("../controllers/InventoryController");

let router = express.Router();

router.post("/add",InventoryController.AddItem);
router.get("/all",InventoryController.GetAllItems);
router.put("/update/:productId",InventoryController.UpdateItem);

module.exports = router;