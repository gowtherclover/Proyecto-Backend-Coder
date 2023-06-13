import express from "express"
import { prodService } from "../services/products.service.js";

export const homeRouter = express.Router()

homeRouter.get('/', async (req,res)=>{
    try{
        let allProducts = await prodService.viewsProducts()
        return res
        .status(200)
        .render('home',{allProducts})
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "error", msg: "Error getting the products" })
    }
    
})