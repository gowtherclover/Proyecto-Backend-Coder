import express from "express";
import { prodService } from "../services/products.service.js";
import { cartService } from "../services/carts.service.js";
export const viewsRouter = express.Router()

viewsRouter.get('/products', async (req,res)=>{
    try{
        const { limit, sort, page: pages, category, stock } = req.query;
        let parsedPage = parseInt(pages);
        let parsedLimit = parseInt(limit);

        const viewProd = await prodService.getAllProducts(req,parsedLimit, sort, parsedPage || 1, category, stock)

        const {hasPrevPage,page,totalPages,hasNextPage,nextLink,prevLink,payload} = viewProd
        let convertData=payload

        convertData = convertData.map((item) => {
            return {
                _id: item._id.toString(),
                title:item.title,
                description:item.description,
                price:item.price,
                thumbnail:item.thumbnail,
                code:item.code,
                stock:item.stock,
                category:item.category,
                status:item.status,
            };
        });

        return res
        .status(200)
        .render('viewsProd', {hasPrevPage,page,totalPages,hasNextPage,nextLink,prevLink,convertData})
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "error", msg: "Error getting the products" })
    }
    
})

viewsRouter.get('/carts/:cid',async (req,res)=>{
    try{
        const cid=req.params.cid
        let cartFinder = await cartService.findOne(cid)
        let total = 0;

        if (cartFinder) {
            cartFinder = cartFinder.products.map((item) => {
                total = total + (item.pid.price * item.quantity)
                return {
                    _id: item.pid._id.toString(),
                    title:item.pid.title,
                    description:item.pid.description,
                    price:item.pid.price,
                    thumbnail:item.pid.thumbnail,
                    code:item.pid.code,
                    stock:item.pid.stock,
                    category:item.pid.category,
                    status:item.pid.status,
                    quantity:item.quantity
                };
            });
            return res.status(200).render('viewsCarts',{cartFinder,total})
        }
        else{
            return res
            .status(400).
            json({status:"error", msg:'cart not found'})
        }
    }
    catch (error) {
        return res.status(500).json({ status: 'error', msg: 'the cart could not be found', error: error.message });
    }
})