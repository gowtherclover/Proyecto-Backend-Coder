//@ts-check
import { Schema, model } from "mongoose";

const productSchema = new Schema({
    quantity: { type: Number, required: true },
});

const cartSchema = new Schema({
    products: { type: [productSchema], required: true },
});

export const CartModel = model("carts", cartSchema);
