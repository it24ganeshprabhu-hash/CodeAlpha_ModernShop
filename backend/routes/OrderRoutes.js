const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const authenticateToken = require("../middleware/auth");

router.post("/place", authenticateToken, OrderController.PlaceOrder);

module.exports = router;