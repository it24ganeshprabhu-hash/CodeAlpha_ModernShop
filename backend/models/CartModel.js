let {MongoClient, ObjectId} = require("mongodb");
const {Client} = require("./UserModel");

const AddToCart = async (userId, cartItem, res)=>{
    let db = Client.db("modernshop_db");
    try{
        const existingCartItem = await db.collection("carts").updateOne(
            {userId: new ObjectId(userId),
                "items.productId": new ObjectId(cartItem.productId)
            },
            {$inc: {"items.$.quantity": cartItem.quantity}},
            
        );

        if (existingCartItem.matchedCount === 0){
            await db.collection("carts").updateOne(
                {userId: new ObjectId(userId)},
                {$push: {items: cartItem}},
                {upsert: true}
            );
        }
        res.status(200).json({message:"Item added to cart successfully"});
    }
    catch(err){
        res.status(500).json({message: "Error adding item to cart", details: err.message});
    }
}

const GetCartItems = async (userId)=>{
    let db = Client.db("modernshop_db");
    try{
        const cart = await db.collection("carts").findOne({userId: new ObjectId(userId)});
        return cart ? cart.items : [];
    }
    catch(err){
        console.error("Error retrieving cart items:", err);
        return null;
    }
}

const RemoveFromCart = async (userId, productId, res)=>{
    let db= Client.db("modernshop_db");
    try{
        let result = await db.collection("carts").updateOne(
            {userId: new ObjectId(userId)},
            {$pull: {items: {productId: new ObjectId(productId)}}}
        );
        res.status(200).json({message:"Item removed from cart successfully", data: result});

    }
    catch(err){
        res.status(500).json({message: "Error removing item from cart", details: err.message});
    }
}


module.exports = {AddToCart, GetCartItems, RemoveFromCart};