//@ts-check
import express from "express";
import handlebars from "express-handlebars";
import { __dirname } from "./config.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { homeRouter } from "./routes/home.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { realTimeProductsRouter } from "./routes/realtimeproducts.routes.js";
import { viewsRouter } from "./routes/views.routes.js";
import { ChatRouter } from "./routes/chat.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { connectMongo } from "./utils/dbConnection.js";
import { connectSocketServer } from "./utils/socketServer.js";

const app = express();
const PORT = 8080;

connectMongo();
const httpServer = app.listen(PORT, () => {
    console.log(
        `APP corriendo en ${__dirname} - escuchando en el servidor puerto http://localhost:${PORT}`
    );
});
connectSocketServer(httpServer)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);
app.use("/chat", ChatRouter);
app.use("/home",homeRouter)
app.use("/realtimeproducts",realTimeProductsRouter)
app.use("/views",viewsRouter)

app.get("*", (req, res) => {
    return res
    .status(404)
    .json({ status: "error", msg: "no se encuentra esa ruta", payload: {} });
});
