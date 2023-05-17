import express from 'express'
import { ProductManager } from '../functions/productManager.js'
export const testSocketRouter = express.Router()

const productManager = new ProductManager('./src/data/data.json')

testSocketRouter.get('/', (req,res)=>{
    const allProd = productManager.getProducts()
    return res.status(200).render("test-socket", {});
})