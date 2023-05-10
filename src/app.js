
import express from "express"
import { productsRouter } from "./routes/products.routes.js"
import { petsRouter } from "./routes/pets.routes.js"

const app = express()
const PORT = 4000



app.listen(PORT,()=>{
    console.log(`escuchando en el servidor puerto http://localhost:${PORT}`);
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))


//todos los ENDPOINTS
app.use('/products', productsRouter)
app.use('/pets', petsRouter)

//otros ENDPOINTS
app.get('*', (req,res)=>{
    return res
    .status(404)
    .json({status:"error", msg:'no se encuentra esa ruta',data:{}})
})