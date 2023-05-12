import express from "express"
import { cartsRouter } from "./routes/carts.routes.js"
import { productsRouter } from "./routes/products.routes.js"
import { testPlantillaProducts } from "./routes/test-plantilla-products.routes.js"
import handlebars from "express-handlebars"
import { __dirname } from "./utils.js"

const app = express()
const PORT = 8080



app.listen(PORT,()=>{
    console.log(`escuchando en el servidor puerto http://localhost:${PORT}`);
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

//cCONFIG DEL MOTOR DE PLANTILLAS
app.engine("handlebars", handlebars.engine())
app.set("views",__dirname+ "/views")
app.set("view engine","handlebars")

//todos los ENDPOINTS
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

//QUIERO DEVOVLER HTML DIRECTO PAGINA COMPLETA ARMADA EN BACK
app.use("/test-plantilla-products",testPlantillaProducts)

//otros ENDPOINTS
app.get('*', (req,res)=>{
    return res
    .status(404)
    .json({status:"error", msg:'no se encuentra esa ruta',data:{}})
})