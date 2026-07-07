let UserModel = require("../models/UserModel");

let RegisterUser = (req, res)=>{
    let customer = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        address: req.body.address,
        username: req.body.username
    }

    UserModel.RegisterUser(customer,res);
}

let LoginUser = (req,res)=>{
    UserModel.LoginUser(req,res);
}

let ShoppingCart = (req,res)=>{
    let cartItem = {
        userId: req.body.userId,
        productId: req.body.productId,
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity || 1 
        
    }
    UserModel.AddToCart(cartItem,res);
}

let RemoveFromCart = (req,res)=>{
    const {userId, productId} = req.body;
    UserModel.RemoveFromCart(userId, productId, res);
}

module.exports = {RegisterUser,LoginUser,ShoppingCart,RemoveFromCart};