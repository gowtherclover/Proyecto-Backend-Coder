import express from "express"
import { ProductManager } from '../functions/productManager.js'
import { uploader } from "../utils.js"
export const cartsRouter = express.Router()

const productManager = new ProductManager('./src/data/data.json')

//INICIO ENDPOINT PRODUCTS
cartsRouter.get('/:id',(req,res)=>{
    const id=req.params.id
    const productoEncontrado = productManager.getProductById(id)
    console.log(productoEncontrado);
    return res
    .status(200)
    .json({status:"success", msg:'Producto encontrado',data:productoEncontrado})
})

cartsRouter.get('/', (req,res)=>{
    try{
        const query = req.query
        const limit = query.limit
        let allProducts = productManager.getProducts()

        if (limit<=allProducts.length) {
            allProducts = allProducts.slice(0,limit);
            return res
            .status(200).
            json({status:"success", msg:'cantidad de productos limitada',data:allProducts})
        }
        else if (limit>=allProducts.length) {
            return res
            .status(400).
            json({status:"error", msg:'la cantidad solicitada es mayor a los productos disponibles'})
        }
        else{
            return res
            .status(200).
            json({status:"success", msg:'todos los productos',data:allProducts})
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "error", msg: "Error al obtener los productos" })
    }
    
})

cartsRouter.delete('/:id', async(req,res)=>{
    const id=req.params.id
    const deletedProduct = await productManager.deleteProduct(id)
    return res
    .status(200).
    json({status:"success", msg:'producto eliminado',data:deletedProduct})
})

cartsRouter.post('/', async (req,res)=>{
    try{
        const pet = req.body
        const createdProduct = await productManager.addProduct(pet)
        
        if (createdProduct) {
            return res
            .status(201).
            json({status:"success", msg:'producto creado'})
        }
        else{
            return res
            .status(400).
            json({status:"error", msg:'no se creo el producto porque no cumple las condiciones'})
        }
        
    }
    catch (error) {
        return res.status(500).json({ status: 'error', msg: 'no se pudo crear el producto', error: error.message });
    }
})

//MODIFICAR UN PRODUCTO (NECEISTO PASAR ID)
cartsRouter.put('/:id',uploader.single('file'),async (req,res)=>{
    if (!req.file) {
        return res
        .status(400).
        json({status:"error", msg:'antes suba un archivo para poder crear la pet'})
    }
    const id=req.params.id
    const path =req.file.filename;
    const newBody = { ...req.body, url: `http://localhost:4000/${path}` };
    const updatedProduct = await productManager.updateProduct(id, newBody)
    if (!updatedProduct) {
        console.log('Producto para actualizar no encontrado')
        return res
        .status(404)
        .json({status:"error", msg:'Producto para actualizar no encontrado',data:{}})
    }

    return res
    .status(200).
    json({status:"success", msg:'producto modificado',data:updatedProduct})
})
//FIN ENDPOINT PRODUCTS
