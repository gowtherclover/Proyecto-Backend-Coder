import express from 'express'
import { ProductManager } from '../DAO/functions/productManager.js'
export const ChatRouter = express.Router()

const productManager = new ProductManager('./src/data/data.json')

ChatRouter.get('/', (req,res)=>{
    const allProd = productManager.getProducts()
    return res.status(200).render("chat", {});
})