import express from "express"
import { ProductManager } from '../functions/productManager.js'
import { uploader } from "../utils.js";

export const testPlantillaProducts = express.Router()

const productManager = new ProductManager('./src/data/data.json')

//INICIO ENDPOINT PRODUCTS
testPlantillaProducts.get('/:pid',(req,res)=>{
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
const users = [
    {
      id: 1,
      name: 'John Doe',
      age: 25,
      email: 'johndoe@example.com',
      address: '123 Street, City',
    },
    {
      id: 2,
      name: 'Jane Smith',
      age: 30,
      email: 'janesmith@example.com',
      address: '456 Avenue, Town',
      role:"admin"
    },
    {
      id: 3,
      name: 'David Johnson',
      age: 40,
      email: 'davidjohnson@example.com',
      address: '789 Road, Village',
    },
    {
      id: 4,
      name: 'Sarah Williams',
      age: 35,
      email: 'sarahwilliams@example.com',
      address: '321 Lane, County',
      role:"admin"
    },
    {
      id: 5,
      name: 'Michael Brown',
      age: 28,
      email: 'michaelbrown@example.com',
      address: '654 Boulevard, Country',
    },
  ];
const food = [
{ name: 'Pizza', price: 10.99 },
{ name: 'Hamburguesa', price: 8.99 },
{ name: 'Ensalada', price: 5.99 },
{ name: 'Sushi', price: 12.99 },
{ name: 'Pastel', price: 6.99 }
];

testPlantillaProducts.get('/', (req,res)=>{
    try{
        let allProducts = productManager.getProducts()
        const title = "Lista de ropa para probar"

        const randomIndex = Math.floor(Math.random() * users.length)
        const randomUser = users[randomIndex]
        console.log(randomUser);
        return res
        .status(200)
        .render('test-plantilla-products', {title, allProducts, isAdmin:randomUser.role, randomUser, food})
    }
    catch (error) {
        return res.status(500).json({ status: "error", msg: "Error al obtener los productos" })
    }
    
})

testPlantillaProducts.delete('/:pid', async(req,res)=>{
    const pid=req.params.pid
    const deletedProduct = await productManager.deleteProduct(pid)
    return res
    .status(200).
    json({status:"success", msg:'producto eliminado',data:deletedProduct})
})

testPlantillaProducts.post('/', async (req,res)=>{
    try{
        const producto = req.body
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
testPlantillaProducts.put('/:pid', uploader.single('file'), async (req,res)=>{
    if (!req.file) {
        return res
        .status(400).
        json({status:"error", msg:'antes suba un archivo para poder modificar el producto'})
    }
    const pid=req.params.pid
    const path =req.file.filename;
    const newBody = { ...req.body, url: `http://localhost:8080/${path}` };
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
