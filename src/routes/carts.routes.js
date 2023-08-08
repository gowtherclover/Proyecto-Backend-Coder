import express from "express"
import { cartController } from "../controllers/carts.controller.js"
import { ticketsController } from "../controllers/tickets.controller.js";
import { isAdmin, isUser } from "../middlewares/main.js";
export const cartsRouter = express.Router()

cartsRouter.get('/',isAdmin, cartController.getAllCarts)

cartsRouter.get('/:cid', cartController.findOne);

cartsRouter.post('/:cid/product/:pid',isUser, cartController.createProd)

cartsRouter.post('/', cartController.createCart)

cartsRouter.delete('/:cid/product/:pid',isUser, cartController.deleteProd)

cartsRouter.delete('/:cid',isAdmin, cartController.deleteCart)

cartsRouter.post('/:cid/purchase',isUser, ticketsController.create)

cartsRouter.get('/purchase', isAdmin,ticketsController.getAll)
