import express from "express";
import { cartsRouter } from "./routes/carts.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { testChatRouter } from "./routes/test-chat.routes.js";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import { connectMongo } from "./utils.js";


const app = express();
const PORT = 8080;

//mongodb+srv://96enzoaguilar:FWSadN7jvyazwmaC@backendcoder.uzv2r7b.mongodb.net/?retryWrites=true&w=majority


connectMongo();

/* app.listen(PORT,()=>{
    console.log(`escuchando en el servidor puerto http://localhost:${PORT}`);
}) */

const httpServer = app.listen(PORT, () => {
    console.log(
        `APP corriendo en ${__dirname} - escuchando en el servidor puerto http://localhost:${PORT}`
    );
});

const socketServer = new Server(httpServer);
let msgs = [];
socketServer.on("connection", (socket) => {
    socket.on("msg_front_back", (msg) => {
        msgs.push(msg);
        console.log(msgs);
        socketServer.emit("msg_back_front", msgs);
    });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//cCONFIG DEL MOTOR DE PLANTILLAS
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//todos los ENDPOINTS
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);

//QUIERO DEVOVLER HTML DIRECTO PAGINA COMPLETA ARMADA EN BACK
app.use("/test-chat", testChatRouter);

//otros ENDPOINTS
app.get("*", (req, res) => {
    return res
    .status(404)
    .json({ status: "error", msg: "no se encuentra esa ruta", data: {} });
});
