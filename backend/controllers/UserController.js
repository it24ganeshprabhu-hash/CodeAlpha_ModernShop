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

let GetProfile = (req,res)=>{
    UserModel.GetProfile(req,res);
    
}

let UpdateProfile = (req,res)=>{
   const userId = req.user.id; 
    const updateData = {
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        password: req.body.password 
    };
    UserModel.UpdateProfile(userId, updateData, res);

}

let GetOrder = (req,res)=>{
    UserModel.GetOrders(req,res);

}
module.exports = {RegisterUser,LoginUser,GetProfile,UpdateProfile,GetOrder};