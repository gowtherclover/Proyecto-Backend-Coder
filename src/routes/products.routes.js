import express from "express";
import { uploader } from "../utils/multer.js";
import { productsController } from "../controllers/products.controller.js";
import { isAdmin } from "../middlewares/main.js";
export const productsRouter = express.Router()

productsRouter.get('/', productsController.getAllProducts)

productsRouter.get('/:pid', productsController.findOne)

productsRouter.delete('/:pid',isAdmin, productsController.delete)

productsRouter.post('/',isAdmin, uploader.single('file'), productsController.create)

productsRouter.put('/:pid',isAdmin, productsController.update)
