const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");


router.post("/place", OrderController.PlaceOrder);

module.exports = router;