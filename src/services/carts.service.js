import { ObjectId } from "mongodb";
import { CartModel } from "../DAO/models/carts.model.js"

class CartsService{
    async getAllCarts() {
        try {
            let allCarts = await CartModel.find({}, { __v: false });
            return allCarts;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to get all carts");
        }
    }

    async findOne(cid) {
        try {
            const cartFinder = await CartModel.findOne({ _id: cid }, { __v: false });

            return cartFinder;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to find the cart");
        }
    }
    
    async createProd({ cid, pid }) {
        try {
            const findProdInCart = await CartModel.findOne({ products: { $elemMatch: { pid: pid } } });

            if (findProdInCart) {
                const productToUpdate = findProdInCart.products.find(product => product.pid.equals(new ObjectId(pid)));

                if (productToUpdate) {
                    await CartModel.updateOne({_id:cid,"products.pid":pid},{$inc: { "products.$.quantity": 1 }})
                }
            } else {
                await CartModel.findOneAndUpdate(
                    { _id: cid },{ $push: { products: { pid: pid, quantity: 1 } } }
                );
            }
            const cartToUpdate = await CartModel.findOne({ _id: cid });
            return cartToUpdate;
            } catch (error) {
                console.error('Error updating cart:', error);
                throw error;
            }
    }

    async createCart(){
        const newCart = await CartModel.create({products: []});
        return newCart
    }

    async deleteProd({ cid, pid }) {
        try {
            const findProdInCart = await CartModel.findOne({ products: { $elemMatch: { pid: pid } } });

            if (findProdInCart) {
                const productToUpdate = findProdInCart.products.find(product => product.pid.equals(new ObjectId(pid)));

                if (productToUpdate.quantity > 1) {
                    await CartModel.updateOne({_id:cid,"products.pid":pid},{$inc: { "products.$.quantity": -1 }})
                }else {
                    await CartModel.findOneAndUpdate({ _id: cid },{ $pull: { products: { pid: pid } } });
                }
            }
            const updatedCart = await CartModel.findOne({ _id: cid });
            return updatedCart; 
        } catch (error) {
            console.error('Error deleting product from cart:', error);
            throw error;
        }
    }

    async deleteCart({ cid }) {
        try {
            const updatedCart = await CartModel.findOneAndUpdate(
                { _id: cid },
                { products: [] },
                { new: true }
            );
            return updatedCart;
        } catch (error) {
            console.error('Error deleting product from cart:', error);
            throw error;
        }
    }

}

export const cartService = new CartsService()