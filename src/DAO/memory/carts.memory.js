import fs from "fs";
import { __dirname } from "../../config.js";
import path from "path";
import { faker } from "@faker-js/faker";
import { ProductsMemory } from "./products.memory.js";

class CartFS{
    constructor() {
        this.path = path.join(__dirname, "/data/carts.json");
        this.readCartsFromFile()
    }

    async readCartsFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')

            if (data) {
                this.Carts = JSON.parse(data)
            } else {
                this.Carts = []
            }
        } catch (error) {
            console.error(error)
            this.Carts = []
        }
    }

    async saveCartsToFile() {
        try {
            const data = JSON.stringify(this.Carts)
            await fs.promises.writeFile(this.path, data)
        } catch (error) {
            console.error(error)
        }
    }

    getAllCarts() {
        return this.Carts;
    }


    findOne(cid) {
        const cartFinder = this.Carts.find((cart) => cart._id === cid);
        if (cartFinder) {
            return cartFinder;
        } else {
            throw new Error("Unable to find the cart");
        }
    }

    findProdInCart({ cid, pid }) {
        const cartFinder = this.Carts.find((cart) => cart._id === cid && cart.products.some((product) => product.pid === pid));
        console.log(cartFinder);
        return cartFinder;
            //throw new Error("Can't find the product in the cart");
    }

    async createCart() {
        try {
            const newCart = {
                _id: faker.database.mongodbObjectId(),
                products: []
            };
            this.Carts.push(newCart);
            await this.saveCartsToFile();
            return newCart;
        } catch (error) {
            console.log(error);
            throw new Error("The cart is not created");
        }
    }

    async updateOneProd({ cid, pid, inc }) {
        try {
            const cartIndex = this.Carts.findIndex((cart) => cart._id === cid);
            if (cartIndex !== -1) {
                const cart = this.Carts[cartIndex];
                const productToUpdate = cart.products.find((product) => product.pid === pid);
                if (productToUpdate) {
                    productToUpdate.quantity += inc;
                } else {
                    const product = await ProductsMemory.findOne(pid)
                    cart.products.push({ pid:{...product}, quantity: 1 });
                }
                await this.saveCartsToFile();
            } else {
                throw new Error("Cart not found");
            }
        } catch (error) {
            console.log(error);
            throw new Error("The product in the cart was not updated");
        }
    }

    async findCartAndUpdate({ cid, pid, operation }) {
        try {
            const cartIndex = this.Carts.findIndex((cart) => cart._id === cid);
            if (cartIndex !== -1) {
                const cart = this.Carts[cartIndex];
                if (operation === 'push') {
                    const existingProduct = cart.products.find((product) => product.pid === pid);
                    if (existingProduct) {
                        existingProduct.quantity += 1;
                    } else {
                        const product = await ProductsMemory.findOne(pid)
                        cart.products.push({ pid:{...product}, quantity: 1 });
                    }
                } else if (operation === 'pull') {
                    cart.products = cart.products.filter((product) => product.pid !== pid);
                } else if (operation === 'clean') {
                    cart.products = [];
                } else {
                    throw new Error('Invalid operation');
                }
                await this.saveCartsToFile();
            } else {
                throw new Error("Cart not found");
            }
        } catch (error) {
            console.log(error);
            throw new Error("The product in the cart was not updated");
        }
    }
}

export const CartsMemory = new CartFS()