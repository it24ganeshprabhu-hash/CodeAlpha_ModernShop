const CartModel = require("../models/CartModel");
const InventoryModel = require("../models/InventoryModel");
const { ObjectId } = require("mongodb");

const AddToCart = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    let product = await InventoryModel.GetProductById(productId);
    if (!product || product.stock < quantity) {
        return res.status(400).json({ message: "Product not available or not enough stock" });
    }

    const cartItem = {
        productId: new ObjectId(productId),
        name: product.name,
        price: product.price,
        quantity: parseInt(quantity),
        description: product.description,
        imageUrl: product.imageUrl
    };

    await CartModel.AddToCart(userId, cartItem, res);
};

const GetCartItems = async (req, res) => {
    const userId = req.user.id;
    const items = await CartModel.GetCartItems(userId);

    if (items === null) return res.status(500).json({ message: "Error retrieving cart" });

    const enrichedItems = await Promise.all(
        items.map(async (item) => {
            const product = await InventoryModel.GetProductById(item.productId);
            return {
                ...item,
                productId: item.productId?.toString ? item.productId.toString() : item.productId,
                name: item.name || product?.name || "Unknown item",
                price: item.price ?? product?.price ?? 0,
                description: item.description || product?.description || "No description available.",
                imageUrl: item.imageUrl || product?.imageUrl || "https://via.placeholder.com/120"
            };
        })
    );

    return res.status(200).json({ data: enrichedItems });
};

const UpdateCartItemQuantity = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantityDelta } = req.body;
    await CartModel.UpdateCartItemQuantity(userId, productId, quantityDelta, res);
};

const RemoveFromCart = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;
    await CartModel.RemoveFromCart(userId, productId, res);
};

module.exports = { AddToCart, GetCartItems, UpdateCartItemQuantity, RemoveFromCart };