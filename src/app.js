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

app.use(
    session({
        store: MongoStore.create({
            mongoUrl: "mongodb+srv://96enzoaguilar:FWSadN7jvyazwmaC@backendcoder.uzv2r7b.mongodb.net/ecommerce?retryWrites=true&w=majority",
            ttl: 15 * 60,
        }),
        secret: "asd3ñc30kasod",
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 15 * 60 * 1000,
        },
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/products",authenticate, productsRouter);
app.use("/api/carts",authenticate, cartsRouter);
app.use("/api/users",authenticate, usersRouter);
app.use("/chat", ChatRouter);
app.use("/home",homeRouter)
app.use("/realtimeproducts",authenticate,realTimeProductsRouter)
app.use("/views",viewsRouter)
app.use("/cookie",cookiesRouter)
app.use("/api/sessions/",sessionsRouter)
app.use("/",sessionsRouter)

function authenticate(req, res, next) {
    if (!req.session.user) {
        return res.render('errorLogin',{msg:'Error authenticate'});
    }
    next()
}

app.get("*", (req, res) => {
    return res.render('errorLogin',{msg:'Error link'});
});
