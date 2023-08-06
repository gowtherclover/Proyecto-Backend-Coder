//import { MongooseProductModel } from "../DAO/models/mongoose/products.mongoose.js";
//import { productsModel } from "../DAO/models/products.model.js"
import { Products } from '../DAO/factory.js';
import { parse } from 'url';

class ProductsService{
    async getAllProducts(req, limit,sort,numberPage,category, stock) {
        try{
            let query = Products.getAllProducts()
            
            if (sort) {
                query = query.sort({ price: sort })
            }

            if (category) {
                query = query.find({ category: category });
            } else if (stock) {
                query = query.find({ stock: stock });
            }
            
            if (limit) {
                query = query.limit(limit)
            }
            
            const pages = await Products.paginate({query,numberPage})


            const { docs, totalPages, page, hasPrevPage, hasNextPage, prevPage, nextPage } = pages;

            const currentLink = `${req.protocol}://${req.get('host')}${req.originalUrl}`

            const response = {
                status: "success",
                payload: docs,
                totalPages,
                prevPage,
                nextPage,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? getPrevLink(currentLink, prevPage) : null,
                nextLink: hasNextPage ? getNextLink(currentLink, nextPage) : null,
            };

            return response;

            function getPrevLink(currentLink, prevPage) {
                const parsedUrl = parse(currentLink, true);
                const searchParams = new URLSearchParams(parsedUrl.search);
                searchParams.set('page', prevPage);
                const updatedLink = `${parsedUrl.pathname}?${searchParams.toString()}`;
                return `${req.protocol}://${req.get('host')}${updatedLink}`
            }
            
            function getNextLink(currentLink, nextPage) {
                const parsedUrl = parse(currentLink, true);
                const searchParams = new URLSearchParams(parsedUrl.search);
                searchParams.set('page', nextPage);
                const updatedLink = `${parsedUrl.pathname}?${searchParams.toString()}`;
                return `${req.protocol}://${req.get('host')}${updatedLink}`
            }
        } catch (error) {
            console.log(error);
            throw new Error("Unable to get products");
        }
    }

    async findOne(pid) {
        try {
            const productFinder = await Products.findOne(pid);
            return productFinder;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to find the product");
        }
    }

    async delete(pid) {
        try {
            const productsDeleted = await Products.deleteOne(pid);
            return productsDeleted;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to delete the product");
        }
    }
    
    async create(product) {
        try {
            const createdProduct = await Products.create(product);
            return createdProduct;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to create the product");
        }
    }

    async update({ pid, price, stock, status, rest }) {
        try {
            const updatedProduct = await Products.update({pid, price, stock, status, rest})
            return updatedProduct;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to update the product");
        }
    }

    async updateOneProd({pid,quantity}) {
        try{
            await Products.updateOneProd({pid,quantity});
        } catch (error) {
            console.log(error);
            throw new Error("Unable to get products");
        }
    }

    async viewsProducts() {
        try {
            const views = await Products.viewsProducts()
            return views;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to find the product");
        }
    }
}

export const prodService = new ProductsService()