const express = require("express");
const InventoryController = require("../controllers/InventoryController");

let router = express.Router();

router.post("/inventory/add",InventoryController.AddItem);
router.get("/inventory/all",InventoryController.GetAllItems);
router.put("/inventory/update/:productId",InventoryController.UpdateItem);

module.exports = router;