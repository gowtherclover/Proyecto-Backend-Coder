import { ObjectId } from "mongodb";
import { cartsModel } from "../DAO/models/carts.model.js";
import { prodService } from "./products.service.js";

class CartsService{
    async getAllCarts() {
        try {
            let allCarts = await cartsModel.getAllCarts()
            return allCarts;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to get all carts");
        }
    }

    async findOne(cid) {
        try {
            const cartFinder = await cartsModel.findOne(cid);

            return cartFinder;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to find the cart");
        }
    }
    
    async createProd({ cid, pid }) {
        try {
            const findProdInCart = await cartsModel.findProdInCart({cid, pid});
            if (findProdInCart) {
                const productToUpdate = findProdInCart.products.find(product => product.pid.equals(new ObjectId(pid)));
                
                if (productToUpdate) {
                    await cartsModel.updateOneProd({cid,pid,inc:1})
                }
            } else {
                await cartsModel.findCartAndUpdate({ cid, pid, operation: 'push' });
            }
            const cartToUpdate = await cartsModel.findOne(cid);
            return cartToUpdate;
            } catch (error) {
                console.error('Error updating cart:', error);
                throw error;
            }
    }

    async createCart(){
        const newCart = await cartsModel.create();
        return newCart
    }

    async deleteProd({ cid, pid }) {
        try {
            const findProdInCart = await cartsModel.findProdInCart({cid, pid});

            if (findProdInCart) {
                const productToUpdate = findProdInCart.products.find(product => product.pid.equals(new ObjectId(pid)));

                if (productToUpdate.quantity > 1) {
                    await cartsModel.updateOneProd({cid,pid,inc:-1})
                }else {
                    await cartsModel.findCartAndUpdate({ cid, pid, operation: 'pull' });
                }
            }
            const cartToUpdate = await cartsModel.findOne(cid);
            return cartToUpdate; 
        } catch (error) {
            console.error('Error deleting product from cart:', error);
            throw error;
        }
    }

    async deleteCart({ cid }) {
        try {
            const cart = await cartsModel.findOne(cid);

            cart.products.forEach(async (product) => {

                const pid = product.pid._id;
                const quantity = product.quantity;

                await prodService.updateOneProd({pid, quantity});
            });
            await cartsModel.findCartAndUpdate({ cid, pid:null, operation: 'clean' });

            const cartToUpdate = await cartsModel.findOne(cid);
            return cartToUpdate; 
        } catch (error) {
            console.error('Error deleting product from cart:', error);
            throw error;
        }
    }

}

export const cartService = new CartsService()