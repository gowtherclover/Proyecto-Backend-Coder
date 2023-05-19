import express from "express"
import { ProductManager } from '../functions/productManager.js';
import { uploader } from "../utils.js";
export const productsRouter = express.Router()

const productManager = new ProductManager('./src/data/data.json')

//INICIO ENDPOINT PRODUCTS
productsRouter.get('/:pid',(req,res)=>{
    try{
        const pid=req.params.pid
        const productoEncontrado = productManager.getProductById(pid)
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
    }
    catch (error) {
        return res.status(500).json({ status: 'error', msg: 'no se pudo encontrar el producto', error: error.message });
    }
})

productsRouter.get('/', (req,res)=>{
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

productsRouter.delete('/:pid', async(req,res)=>{
    const pid=req.params.pid
    const deletedProduct = await productManager.deleteProduct(pid)
    return res
    .status(200).
    json({status:"success", msg:'producto eliminado',data:deletedProduct})
})

productsRouter.post('/',  uploader.single('file'), async (req,res)=>{
    try{
        if (!req.file) {
            return res
            .status(400).
            json({status:"error", msg:'antes suba un archivo para poder modificar el producto'})
        }

        const name =req.file.filename;
        console.log(req.file.path);
        const producto = { ...req.body, thumbnail: `http://localhost:8080/${name}`, path:`${req.file.path}` };
        const createdProduct = await productManager.addProduct(producto)
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

//MODIFICAR UN PRODUCTO (NECEISTO PASAR pid)
productsRouter.put('/:pid', async (req,res)=>{
    const pid=req.params.pid
    const newBody = req.body
    const updatedProduct = await productManager.updateProduct(pid, newBody)
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
