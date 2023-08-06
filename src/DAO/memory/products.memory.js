import fs from "fs";
import { __dirname } from "../../config.js";
import path from "path";
import { faker } from "@faker-js/faker";

class ProductsFS{
    constructor() {
        this.path = path.join(__dirname, "/data/products.json");
        this.readUsersFromFile()
    }

    async readUsersFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')

            if (data) {
                this.Products = JSON.parse(data)
            } else {
                this.Products = []
            }
        } catch (error) {
            console.error(error)
            this.Products = []
        }
    }

    async saveUsersToFile() {
        try {
            const data = JSON.stringify(this.Products)
            await fs.promises.writeFile(this.path, data)
        } catch (error) {
            console.error(error)
        }
    }

    getAllProducts() {
        try {
            return this.Products;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to get products");
        }
    }

    async paginate({ query, numberPage }) {
        try {
            const pageSize = 3;
            const startIndex = (numberPage - 1) * pageSize;
            const endIndex = numberPage * pageSize;
            const paginatedData = query.slice(startIndex, endIndex);
            const totalPages = Math.ceil(query.length / pageSize);

            return {
                docs: paginatedData,
                totalPages,
                page: numberPage,
                hasPrevPage: numberPage > 1,
                hasNextPage: numberPage < totalPages,
                prevPage: numberPage > 1 ? numberPage - 1 : null,
                nextPage: numberPage < totalPages ? numberPage + 1 : null,
            };
        } catch (error) {
            console.log(error);
            throw new Error("Unable to get products");
        }
    }

    async findOne(pid) {
        try {
            const productFinder = this.products.find(product => product._id === pid);
            if (productFinder) {
                return productFinder;
            } else {
                throw new Error("Product not found");
            }
        } catch (error) {
            console.log(error);
            throw new Error("Unable to find the product");
        }
    }

    async delete(pid) {
        try {
            const productIndex = this.products.findIndex(product => product._id === pid);
            if (productIndex !== -1) {
                this.products.splice(productIndex, 1);
                await this.saveProductsToFile();
            } else {
                throw new Error("Product not found");
            }
        } catch (error) {
            console.log(error);
            throw new Error("Unable to delete the product");
        }
    }

    async create(product) {
        try {
            const newProduct = { ...product, _id: faker.database.mongodbObjectId() };
            this.products.push(newProduct);
            await this.saveProductsToFile();
            return newProduct;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to create the product");
        }
    }

    async update({ pid, price, stock, status, ...rest }) {
        try {
            const productIndex = this.products.findIndex(product => product._id === pid);
            if (productIndex !== -1) {
                this.products[productIndex] = {
                    ...this.products[productIndex],
                    price: Number(price),
                    stock: Number(stock),
                    status: status === 'available',
                    ...rest
                };
                await this.saveProductsToFile();
                return this.products[productIndex];
            } else {
                throw new Error("Product not found");
            }
        } catch (error) {
            console.log(error);
            throw new Error("Unable to update the product");
        }
    }

    async updateOneProd({ pid, quantity }) {
        try {
            const productIndex = this.products.findIndex(product => product._id === pid);
            if (productIndex !== -1) {
                this.products[productIndex].stock += quantity;
                await this.saveProductsToFile();
            } else {
                throw new Error("Product not found");
            }
        } catch (error) {
            console.log(error);
            throw new Error("Unable to update the product");
        }
    }
}

export const ProductsMemory = new ProductsFS()