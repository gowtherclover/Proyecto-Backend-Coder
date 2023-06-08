//@ts-check
import { Schema, model } from "mongoose";

const productSchema = new Schema(
    {
    pid: { type: String, required: true },
    quantity: { type: Number, required: true },
    },
    { _id: false }
);

const cartSchema = new Schema({
    products: { type: [productSchema], required: true },
});

export const CartModel = model("carts", cartSchema);
