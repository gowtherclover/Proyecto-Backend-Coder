import express from "express"
import { ProductManager } from '../functions/productManager.js'

export const realTimeProductsRouter = express.Router()

const productManager = new ProductManager('./src/data/data.json')

realTimeProductsRouter.get('/', (req,res)=>{
    try{
        let allProducts = productManager.getProducts()

        return res
        .status(200)
        .render('realtimeproducts', {allProducts})
    }
    catch (error) {
        return res.status(500).json({ status: "error", msg: "Error al obtener los productos" })
    }
    
})