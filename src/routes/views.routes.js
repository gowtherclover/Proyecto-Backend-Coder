import express from "express";
import { viewsController } from "../controllers/views.controller.js";
import { authenticate } from "../middlewares/main.js";
import { ticketsController } from "../controllers/tickets.controller.js";
export const viewsRouter = express.Router()

viewsRouter.get('/products',authenticate, viewsController.getProducts)

viewsRouter.get('/carts/:cid',authenticate,viewsController.getCart)

viewsRouter.get('/purchase/:tid',authenticate,ticketsController.getOne)