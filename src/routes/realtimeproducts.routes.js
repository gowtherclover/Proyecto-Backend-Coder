import express from "express"
import { ProductManager } from '../functions/productManager.js'

export const realTimeProductsRouter = express.Router()

const productManager = new ProductManager('./src/data/data.json')

realTimeProductsRouter.get('/', (req,res)=>{
    try{
        let IDs = productManager.getIDs()
        return res
        .status(200)
        .render('realtimeproducts', {IDs})
    }
    catch (error) {
        return res.status(500).json({ status: "error", msg: "Error al obtener los productos" })
    }
    
})