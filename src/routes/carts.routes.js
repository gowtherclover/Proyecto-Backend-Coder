import express from "express"
import { ProductManager } from '../functions/productManager.js'
export const cartsRouter = express.Router()

const cartManager = new ProductManager('./src/data/cart.json')
const productManager = new ProductManager('./src/data/data.json')

//INICIO ENDPOINT CARTS
cartsRouter.get('/', (req,res)=>{
    try{
        let allProducts = cartManager.getProducts()
        return res
        .status(200).
        json({status:"success", msg:'cantidad de productos en el carrito',data:allProducts})
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "error", msg: "Error al obtener el carrito" })
    }
    
})

cartsRouter.get('/:cid',(req,res)=>{
    const cid=req.params.cid
    const productoEncontrado = cartManager.getProductById(cid)
    if (productoEncontrado) {
        return res
        .status(201).
        json({status:"success", msg:'Producto encontrado',data:productoEncontrado})
    }
    else{
        return res
        .status(400).
        json({status:"error", msg:'no se encontro el producto'})
    }
})

cartsRouter.post('/', async (req,res)=>{
    try{
        const producto = req.body
        const createdProduct = await cartManager.addToCart(producto)
        if (createdProduct) {
            return res
            .status(201).
            json({status:"success", msg:'producto agregado al carrito'})
        }
        else{
            return res
            .status(400).
            json({status:"error", msg:'no se agrego el producto al carrito'})
        }
    }
    catch (error) {
        return res.status(500).json({ status: 'error', msg: 'no se pudo agregar el producto al carrito', error: error.message });
    }
})

cartsRouter.post('/:cid/product/:pid', async (req,res)=>{
    try{
        const cid = req.params.cid
        const pid = req.params.pid
        const productById= await productManager.getProductById(pid)
        const createdProduct = await cartManager.addProductToCart(cid,productById)
        if (createdProduct) {
            return res
            .status(201).
            json({status:"success", msg:'producto agregado al carrito'})
        }
        else{
            return res
            .status(400).
            json({status:"error", msg:'no se agrego el producto al carrito'})
        }
    }
    catch (error) {
        return res.status(500).json({ status: 'error', msg: 'no se pudo agregar el producto al carrito', error: error.message });
    }
})
//FIN ENDPOINT CARTS
