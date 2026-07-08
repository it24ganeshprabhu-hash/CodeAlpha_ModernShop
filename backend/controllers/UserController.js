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



module.exports = {RegisterUser,LoginUser};