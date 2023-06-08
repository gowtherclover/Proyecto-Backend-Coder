import express from "express"
import { ProductManager } from '../DAO/functions/productManager.js'


export const homeRouter = express.Router()

const productManager = new ProductManager('./src/data/data.json')

homeRouter.get('/', (req,res)=>{
    try{
        let allProducts = productManager.getProducts()

        return res
        .status(200)
        .render('home', {allProducts})
    }
    catch (error) {
        return res.status(500).json({ status: "error", msg: "Error al obtener los productos" })
    }
    
})