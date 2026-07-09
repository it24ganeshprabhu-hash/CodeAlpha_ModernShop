const express = require("express");
const UserController = require("../controllers/UserController");
const CartController = require("../controllers/CartController");

let router = express.Router();

router.post("/register",UserController.RegisterUser);
router.post("/login",UserController.LoginUser);
router.post("/cart/add",CartController.AddToCart);
router.get("/cart/items", CartController.GetCartItems);
router.delete("/cart/remove",CartController.RemoveFromCart);

module.exports = router;