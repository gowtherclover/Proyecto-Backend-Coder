import express from "express"
import { cartsRouter } from "./routes/carts.routes.js"
import { productsRouter } from "./routes/products.routes.js"
import { homeRouter } from "./routes/home.routes.js"
import { realTimeProductsRouter } from "./routes/realtimeproducts.routes.js"
import handlebars from "express-handlebars"
import { __dirname } from "./utils.js"
import {Server} from 'socket.io'

const app = express()
const PORT = 8080

const httpServer = app.listen(PORT,()=>{
    console.log(`escuchando en el servidor puerto http://localhost:${PORT}`);
})

const socketServer = new Server(httpServer)

socketServer.on('connection',(socket)=>{
    socket.on('msg_front_back',(allProd)=>{
        socketServer.emit('msg_back_front', allProd)
    })
    
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
app.use("/home",homeRouter)
app.use("/realtimeproducts",realTimeProductsRouter)

//otros ENDPOINTS
app.get('*', (req,res)=>{
    return res
    .status(404)
    .json({status:"error", msg:'no se encuentra esa ruta',data:{}})
})