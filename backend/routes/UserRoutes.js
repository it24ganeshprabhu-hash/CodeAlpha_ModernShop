const express = require("express");
const UserController = require("../controllers/UserController");

let router = express.Router();

router.post("/register",UserController.RegisterUser);
router.get("/login",UserController.LoginUser);
router.post("/cart/add",UserController.ShoppingCart);
router.delete("/cart/remove",UserController.RemoveFromCart);

module.exports = router;