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
    
    async create({ cid, pid }) {
        try {
            const findProdInCart = await CartModel.findOne({ products: { $elemMatch: { pid: pid } } });

            if (findProdInCart) {
                const productToUpdate = findProdInCart.products.find(product => product.pid === pid);
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


}

export const cartService = new CartsService()