const express = require("express");
const UserController = require("../controllers/UserController");
const CartController = require("../controllers/CartController");
const authenticateToken = require("../middleware/auth"); 
let router = express.Router();
router.post("/register", UserController.RegisterUser);
router.post("/login", UserController.LoginUser);
router.get("/profile",authenticateToken, UserController.GetProfile);
router.put("/profile/update",authenticateToken, UserController.UpdateProfile);
router.get("/orders",authenticateToken, UserController.GetOrder);
router.post("/cart/add", authenticateToken, CartController.AddToCart);
router.get("/cart/items", authenticateToken, CartController.GetCartItems);
router.patch("/cart/update", authenticateToken, CartController.UpdateCartItemQuantity);
router.delete("/cart/remove", authenticateToken, CartController.RemoveFromCart);

module.exports = router;