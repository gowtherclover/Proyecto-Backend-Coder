import express from 'express'
import { ProductManager } from '../functions/productManager.js'
export const testChatRouter = express.Router()

const productManager = new ProductManager('./src/data/data.json')

testChatRouter.get('/', (req,res)=>{
    const allProd = productManager.getProducts()
    return res.status(200).render("test-chat", {});
})