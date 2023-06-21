import { ProductModel } from "../DAO/models/products.model.js"
import { parse } from 'url';

class ViewsService{
    async getAllProducts(req, limit,sort,numberPage,category, stock) {
        try{
            let query = ProductModel.find({},{path: false, __v: false,});

            if (sort) {
                query = query.sort({ price: sort })
            }

            if (category) {
                query = query.find({ category: category });
            } else if (stock) {
                query = query.find({ stock: stock });
            }

            const products = await query.limit(limit)

            const pages = await ProductModel.paginate(query,{limit:3, page:numberPage || 1})

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

    async viewsProducts() {
        try {
            const views = await ProductModel.find({},{
                path:false,
                __v:false
            }).lean()

            return views;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to find the product");
        }
    }
}

export const viewService = new ViewsService()