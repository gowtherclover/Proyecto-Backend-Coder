import express from "express";
import { ProductModel } from "../DAO/models/products.model.js";
import { uploader } from "../utils/multer.js";
export const productsRouter = express.Router()

//INICIO ENDPOINT PRODUCTS
productsRouter.get('/:pid',async (req,res)=>{
    try{
        const pid=req.params.pid
        console.log(pid);
        const productoEncontrado = await ProductModel.findOne({_id:pid})
        if (productoEncontrado) {
            return res
            .status(201).
            json({status:"success", msg:'Producto encontrado',payload:productoEncontrado})
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

productsRouter.get('/', async (req,res)=>{
    try{
        const query = req.query
        const limit = query.limit
        let allProducts = await ProductModel.find({});

        if (limit<=allProducts.length) {
            let limitProd = await ProductModel.find({},{title:true,category:true}).limit(limit);
            return res
            .status(200).
            json({status:"success", msg:'cantidad de productos limitada',payload:limitProd})
        }
        else if (limit>=allProducts.length) {
            return res
            .status(400).
            json({status:"error", msg:'la cantidad solicitada es mayor a los productos disponibles'})
        }
        else{
            return res
            .status(200).
            json({status:"success", msg:'todos los productos',payload:allProducts})
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "error", msg: "Error al obtener los productos" })
    }
    
})

productsRouter.delete('/:pid', async(req,res)=>{
    try{
        const pid=req.params.pid
        const deletedProduct = await ProductModel.deleteOne({_id:pid})
        return res
        .status(200).
        json({status:"success", msg:'producto eliminado',payload:deletedProduct})
    }
    catch (error) {
        return res.status(500).json({ status: 'error', msg: 'no se pudo eliminar el producto', error: error.message });
    }
})

productsRouter.post('/', uploader.single('file'), async (req,res)=>{
    try{
        if (!req.file) {
            return res
            .status(400).
            json({status:"error", msg:'antes suba un archivo para poder modificar el producto'})
        }

        const name =req.file.filename;
        const producto = { ...req.body, thumbnail: `http://localhost:8080/${name}`, path:`${req.file.path}` };
        console.log(producto);
        const createdProduct = await ProductModel.create(producto)
        if (createdProduct) {
            return res
            .status(201).
            json({status:"success", msg:'producto creado',payload:createdProduct})
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
productsRouter.put('/:pid',async (req,res)=>{
    try{
        const pid=req.params.pid
        const {price,stock,status,...rest} = req.body
        console.log(req.body);
        const updatedProduct = await ProductModel.findOneAndUpdate(
            {_id:pid},
            {$set: {
                price: Number(price),
                stock: Number(stock),
                status: status === 'available',
                ...rest
                }
            }
        )
        console.log(await ProductModel.find({_id:pid}));
        if (!updatedProduct) {
            console.log('Producto para actualizar no encontrado')
            return res
            .status(404)
            .json({status:"error", msg:'Producto para actualizar no encontrado',payload:{}})
        }

        return res
        .status(200).
        json({status:"success", msg:'producto modificado',payload:updatedProduct})
    }
    catch (error) {
        return res.status(500).json({ status: 'error', msg: 'no se pudo actualizar el producto', error: error.message });
    }
})
//FIN ENDPOINT PRODUCTS
