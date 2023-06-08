import { ProductModel } from "../DAO/models/products.model.js"

class ProductsService{
    async getAllProducts(limit) {
        try {
            const products = await ProductModel.find(
                {},
                {
                path: false,
                __v: false,
                }
            );
            if (limit) {
                const limitProd = await ProductModel.find(
                {},
                {
                    _id: true,
                    title: true,
                    price: true,
                    thumbnail: true,
                    stock: true,
                }
                ).limit(limit);
                return limitProd;
            }
            return products;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to get products");
        }
    }

    async findOne(pid) {
        try {
            const productFinder = await ProductModel.findOne(
                { _id: pid },
                {
                path: false,
                __v: false,
                }
            );
            return productFinder;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to find the product");
        }
    }

    async delete(pid) {
        try {
            const productsDeleted = await ProductModel.deleteOne({ _id: pid });
            return productsDeleted;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to delete the product");
        }
    }
    
    async create(product) {
        try {
            const createdProduct = await ProductModel.create(product);
            return createdProduct;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to create the product");
        }
    }

    async update({ pid, price, stock, status, rest }) {
        try {
            const updatedProduct = await ProductModel.findOneAndUpdate(
                { _id: pid },
                {
                    $set: {
                        price: Number(price),
                        stock: Number(stock),
                        status: status === 'available',
                        ...rest
                    }
                }
            );
            return updatedProduct;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to update the product");
        }
    }
}

export const prodService = new ProductsService()