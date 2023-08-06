import { MongooseCartModel } from "./mongoose/carts.mongoose.js";

class CartsModel{
    async getAllCarts() {
        try {
            let allCarts = await MongooseCartModel.find({}, { __v: false });
            return allCarts;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to get all carts");
        }
    }

    async findOne(cid) {
        try {
            const cartFinder = await MongooseCartModel.findOne({ _id: cid }, { __v: false });
            return cartFinder;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to find the cart");
        }
    }

    async findProdInCart({cid,pid}) {
        try {
            const findProdInCart = await MongooseCartModel.findOne({_id:cid, products: { $elemMatch: { pid: pid } } });
            return findProdInCart;
        } catch (error) {
            console.log(error);
            throw new Error("Can't find the product in the cart");
        }
    }
    
    async createProd({ cid, pid }) {
        try {
            const findProdInCart = await MongooseCartModel.findOne({_id:cid, products: { $elemMatch: { pid: pid } } });
            if (findProdInCart) {
                const productToUpdate = findProdInCart.products.find(product => product.pid.equals(new ObjectId(pid)));
                
                if (productToUpdate) {
                    await MongooseCartModel.updateOne({_id:cid,"products.pid":pid},{$inc: { "products.$.quantity": 1 }})
                }
            } else {
                await MongooseCartModel.findOneAndUpdate(
                    { _id: cid },{ $push: { products: { pid: pid, quantity: 1 } } }
                );
            }
            const cartToUpdate = await MongooseCartModel.findOne({ _id: cid });
            return cartToUpdate;
            } catch (error) {
                console.error('Error updating cart:', error);
                throw error;
            }
    }

    async createCart(){
        try {
            const newCart = await MongooseCartModel.create({products: []});
            return newCart
        } catch (error) {
            console.log(error);
            throw new Error("The cart is not created");
        }
    }

    async updateOneProd({cid,pid,inc}){
        try {
            await MongooseCartModel.updateOne({_id:cid,"products.pid":pid},{$inc: { "products.$.quantity": inc }})
        } catch (error) {
            console.log(error);
            throw new Error("The product in the cart was not updated");
        }
    }

    async findCartAndUpdate({cid,pid,operation}){
        try {
            let updateQuery;
            if (operation === 'push') {
                updateQuery = { $push: { products: { pid: pid, quantity: 1 } } };
            } else if (operation === 'pull') {
                updateQuery = { $pull: { products: { pid: pid } } };
            } else if (operation === 'clean') {
                updateQuery = { products: [] },{ new: true }
            } else {
                throw new Error('Invalid operation');
            }

            await MongooseCartModel.findOneAndUpdate({ _id: cid }, updateQuery);
        } catch (error) {
            console.log(error);
            throw new Error("The product in the cart was not updated");
        }
    }
}

export const CartsMongo = new CartsModel()
