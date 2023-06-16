import express from "express";
import { prodService } from "../services/products.service.js";
import { uploader } from "../utils/multer.js";
export const viewsProductsRouter = express.Router()

viewsProductsRouter.get('/', async (req,res)=>{
    try{
        const query = req.query
        const limit = query.limit
        let allProducts = await prodService.getAllProducts()

        if (limit<=allProducts.length) {
            let limitProd = await prodService.getAllProducts(limit)
            return res
            .status(200).
            json({status:"success", msg:'limited number of products',payload:limitProd})
        }
        else if (limit>=allProducts.length) {
            return res
            .status(400).
            json({status:"error", msg:'the quantity requested is greater than the products available'})
        }
        else{
            return res
            .status(200).
            json({status:"success", msg:'all the products',payload:allProducts})
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "error", msg: "Error getting the products" })
    }
    
})

viewsProductsRouter.get('/:pid',async (req,res)=>{
    try{
        const pid=req.params.pid
        const productFinder = await prodService.findOne(pid)
        if (productFinder) {
            return res
            .status(201).
            json({status:"success", msg:'Product found',payload:productFinder})
        }
        else{
            return res
            .status(400).
            json({status:"error", msg:'product not found'})
        }
    }
    catch (error) {
        return res.status(500).json({ status: 'error', msg: 'the product could not be found', error: error.message });
    }
})

viewsProductsRouter.delete('/:pid', async(req,res)=>{
    try{
        const pid=req.params.pid
        const deletedProduct = await prodService.delete(pid)
        return res
        .status(200).
        json({status:"success", msg:'removed product',payload:deletedProduct})
    }
    catch (error) {
        return res.status(500).json({ status: 'error', msg: 'could not delete product', error: error.message });
    }
})

viewsProductsRouter.post('/', uploader.single('file'), async (req,res)=>{
    try{
        if (!req.file) {
            return res
            .status(400).
            json({status:"error", msg:'before upload a file to be able to modify the product'})
        }

        const name =req.file.filename;
        const product = { ...req.body, thumbnail: `http://localhost:8080/${name}`, path:`${req.file.path}` };
        const createdProduct = await prodService.create(product)
        if (createdProduct) {
            return res
            .status(201).
            json({status:"success", msg:'product created',payload:createdProduct})
        }
        else{
            return res
            .status(400).
            json({status:"error", msg:'The product was not created because it does not meet the conditions'})
        }
        
    }
    catch (error) {
        return res.status(500).json({ status: 'error', msg: 'could not create product', error: error.message });
    }
})

viewsProductsRouter.put('/:pid',async (req,res)=>{
    try{
        const pid=req.params.pid
        const {price,stock,status,...rest} = req.body
        const updatedProduct = await prodService.update({pid,price,stock,status,rest})
        if (!updatedProduct) {
            return res
            .status(404)
            .json({status:"error", msg:'Product to update not found',payload:{}})
        }

        return res
        .status(200).
        json({status:"success", msg:'modified product',payload:updatedProduct})
    }
    catch (error) {
        return res.status(500).json({ status: 'error', msg: 'could not update the product', error: error.message });
    }
})
