import { prodService } from "../services/products.service.js";

class ProductsController{
    getAllProducts = async (req,res)=>{
        try{
            const { limit, sort, page, category, stock } = req.query;
    
            let parsedLimit = parseInt(limit);
            let parsedPage = parseInt(page);
    
            if (isNaN(parsedLimit) || parsedLimit <= 0) {
                parsedLimit = 10;
            }
    
            if (parsedLimit) {
                let limitProd = await prodService.getAllProducts(req, parsedLimit, sort, parsedPage, category, stock);
                return res.status(200).json({ status: "success", msg: 'limited number of products', payload: limitProd });
            } else {
                return res.status(400).json({ status: "error", msg: 'invalid limit parameter' });
            }
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({ status: "error", msg: "Error getting the products" })
        }
    }

    findOne = async (req,res)=>{
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
    }

    delete = async(req,res)=>{
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
    }

    create = async (req,res)=>{
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
    }

    update = async (req,res)=>{
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
    }
}

export const productsController = new ProductsController()