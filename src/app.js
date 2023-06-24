//@ts-check
import cookieParser from 'cookie-parser';
import express from "express";
import handlebars from "express-handlebars";
import session from 'express-session';
import { __dirname } from "./config.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { ChatRouter } from "./routes/chat.routes.js";
import { cookiesRouter } from "./routes/cookies.routes.js";
import { homeRouter } from "./routes/home.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { realTimeProductsRouter } from "./routes/realtimeproducts.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { viewsRouter } from "./routes/views.routes.js";
import { sessionsRouter } from "./routes/sessions.routes.js";
import { connectMongo } from "./utils/dbConnection.js";
import { connectSocketServer } from "./utils/socketServer.js";
import MongoStore from 'connect-mongo';

const app = express();
const PORT = 8080;

connectMongo();
const httpServer = app.listen(PORT, () => {
    console.log(
        `APP corriendo en ${__dirname} - escuchando en el servidor puerto http://localhost:${PORT}`
    );
});
connectSocketServer(httpServer)
app.use(cookieParser('4lg0s3cr3t0'));

app.use(session({ 
    secret: "asd3ñc30kasod" ,
    resave:false,
    saveUninitialized:true,

    store: MongoStore.create({
        mongoUrl: "mongodb+srv://96enzoaguilar:FWSadN7jvyazwmaC@backendcoder.uzv2r7b.mongodb.net/ecommerce?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true",
        ttl: 15,
    })
}));



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
app.use("/cookie",cookiesRouter)
app.use("/api/sessions/",sessionsRouter)
app.use("/",(req,res)=>{
    res.render('index')
})

app.get("*", (req, res) => {
    return res
    .status(404)
    .json({ status: "error", msg: "no se encuentra esa ruta", payload: {} });
});
