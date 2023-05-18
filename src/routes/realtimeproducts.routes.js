import express from "express"

export const realTimeProductsRouter = express.Router()

realTimeProductsRouter.get('/', (req,res)=>{
    try{
        return res
        .status(200)
        .render('realtimeproducts', {})
    }
    catch (error) {
        return res.status(500).json({ status: "error", msg: "Error al obtener los productos" })
    }
    
})