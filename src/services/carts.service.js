import { ObjectId } from "mongodb";
import { Carts } from "../DAO/factory.js";
//import { cartsModel } from "../DAO/models/carts.model.js";
import { prodService } from "./products.service.js";
import config from "../config/config.js";

class CartsService{
    async getAllCarts() {
        try {
            let allCarts = await Carts.getAllCarts()
            return allCarts;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to get all carts");
        }
    }

    async findOne(cid) {
        try {
            const cartFinder = await Carts.findOne(cid);

            return cartFinder;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to find the cart");
        }
    }
    
    async createProd({ cid, pid }) {
        try {
            const findProdInCart = await Carts.findProdInCart({cid, pid});
            if (findProdInCart) {
                if (config.persistence == 'MONGO') {
                    const productToUpdate = findProdInCart.products.find(product => product.pid.equals(new ObjectId(pid)));
                    if (productToUpdate) {
                        await Carts.updateOneProd({cid,pid,inc:1})
                    }
                }else{
                    const productToUpdate = findProdInCart.products.find(product => product.pid._id == pid);
                    if (productToUpdate) {
                        await Carts.updateOneProd({cid,pid,inc:1})
                    }
                }
            } else {
                await Carts.findCartAndUpdate({ cid, pid, operation: 'push' });
            }
            const cartToUpdate = await Carts.findOne(cid);
            return cartToUpdate;
            } catch (error) {
                console.error('Error updating cart:', error);
                throw error;
            }
    }

    async createCart(){
        const newCart = await Carts.create();
        return newCart
    }

    async deleteProd({ cid, pid }) {
        try {
            const findProdInCart = await Carts.findProdInCart({cid, pid});
            if (findProdInCart) {
                if (config.persistence == 'MONGO') {
                    const productToUpdate = findProdInCart.products.find(product => product.pid.equals(new ObjectId(pid)));
                    if (productToUpdate.quantity > 1) {
                        await Carts.updateOneProd({cid,pid,inc:-1})
                    }else {
                        await Carts.findCartAndUpdate({ cid, pid, operation: 'pull' });
                    }
                }else{
                    const productToUpdate = findProdInCart.products.find(product => product.pid._id == pid);
                    if (productToUpdate.quantity > 1) {
                        await Carts.updateOneProd({cid,pid,inc:-1})
                    }else {
                        await Carts.findCartAndUpdate({ cid, pid, operation: 'pull' });
                    }
                }
            }
            const cartToUpdate = await Carts.findOne(cid);
            return cartToUpdate; 
        } catch (error) {
            console.error('Error deleting product from cart:', error);
            throw error;
        }
    }

    async deleteCart({ cid }) {
        try {
            const cart = await Carts.findOne(cid);

            cart.products.forEach(async (product) => {

                const pid = product.pid._id;
                const quantity = product.quantity;

                await prodService.updateOneProd({pid, quantity});
            });
            await Carts.findCartAndUpdate({ cid, pid:null, operation: 'clean' });

            const cartToUpdate = await Carts.findOne(cid);
            return cartToUpdate; 
        } catch (error) {
            console.error('Error deleting product from cart:', error);
            throw error;
        }
    }

}

export const cartService = new CartsService()