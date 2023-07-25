//@ts-check
import { Schema, model } from "mongoose";

const productSchema = new Schema(
    {
    pid: { type: Schema.Types.ObjectId, ref: 'products', required: true },
    quantity: { type: Number, required: true },
    },
    { _id: false }
);

const cartSchema = new Schema({
    products: { type: [productSchema], required: true },
});

cartSchema.pre('findOne', function () {
    this.populate('products.pid');
});

cartSchema.pre('find', function () {
    this.populate('products.pid');
});

export const MongooseCartModel = model("carts", cartSchema);
