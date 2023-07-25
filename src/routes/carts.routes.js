import express from "express"
import { cartController } from "../controllers/carts.controller.js"
export const cartsRouter = express.Router()

cartsRouter.get('/', cartController.getAllCarts)

cartsRouter.get('/:cid', cartController.findOne);

cartsRouter.post('/:cid/product/:pid', cartController.createProd)

cartsRouter.post('/', cartController.createCart)

cartsRouter.delete('/:cid/product/:pid', cartController.deleteProd)

cartsRouter.delete('/:cid', cartController.deleteCart)

