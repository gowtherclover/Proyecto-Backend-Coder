const express = require("express")
const ProductManager = require('./productManager')

const app = express()
const PORT = 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const productManager = new ProductManager('data.json')

let products=[
    {id:'660862793794',name:'remera',price:750},
    {id:'660342793794',name:'pantalon',price:750},
    {id:'660562793794',name:'jean',price:750},
    {id:'660762793794',name:'zapatilla',price:750},
    {id:'660762793794',name:'buzo',price:750},
    {id:'660122793794',name:'buzo rojo',price:750},
    {id:'660342793794',name:'remera roja',price:750},
    {id:'660552793794',name:'jean negro',price:750},
]

//INICIO ENDPOINT PRODUCTS
app.get('/products/:id',(req,res)=>{
    const id=req.params.id
    //const productoEncontrado = products.find((c)=>c.id == id)
    const productoEncontrado = productManager.getProductById(id)
    return res
    .status(200)
    .json({status:"success", msg:'Producto encontrado',data:productoEncontrado})
})

app.get('/products',(req,res)=>{
    const allProducts = productManager.getProducts()
    return res
    .status(200).
    json({status:"success", msg:'todos los productos',data:allProducts})
})

//BORRAR UN PRODUCTO (NECEISTO PASAR ID)
app.delete('/products/:id',(req,res)=>{
    const id=req.params.id
    //products = products.filter((p)=>p.id != id)
    const deletedProduct = productManager.deleteProduct(id)
    return res
    .status(200).
    json({status:"success", msg:'producto eliminado',data:deletedProduct})
})

//CREAR UN PRODUCTO (NO NECEISTO PASAR ID)
app.post('/products',(req,res)=>{
    const producto = req.body
    //producto.id = (Math.random () * 1000000000000).toFixed(0)
    //products.push(producto)
    const createdProduct = productManager.addProduct(producto)
    return res
    .status(201).
    json({status:"success", msg:'producto creado',data:createdProduct})
})

//MODIFICAR UN PRODUCTO (NECEISTO PASAR ID)
app.put('/products/:id',(req,res)=>{
    const id=req.params.id
    const newBody=req.body

    /* const productIndex = products.findIndex((prod) => prod.id === id)
        if (productIndex === -1) {
            console.log('Producto para actualizar no encontrado')
            return false
        }
        const product = { id:products[productIndex].id, ...newBody }
        products[productIndex] = product */
    const updatedProduct = productManager.updateProduct(id, newBody)
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

app.get('*', (req,res)=>{
    return res
    .status(404)
    .json({status:"error", msg:'no se encuentra esa ruta',data:{}})
})


app.listen(PORT,()=>{
    console.log(`escuchando en el servidor puerto http://localhost:${PORT}`);
})