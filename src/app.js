import express from "express"
import { productsRouter } from "./routes/products.routes.js"
import { cartsRouter } from "./routes/carts.routes.js"

const app = express()
const PORT = 8080



app.listen(PORT,()=>{
    console.log(`escuchando en el servidor puerto http://localhost:${PORT}`);
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))


//todos los ENDPOINTS
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

//otros ENDPOINTS
app.get('*', (req,res)=>{
    return res
    .status(404)
    .json({status:"error", msg:'no se encuentra esa ruta',data:{}})
})