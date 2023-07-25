import express from "express";
import { prodService } from "../services/products.service.js";
import { uploader } from "../utils/multer.js";
import { productsController } from "../controllers/products.controller.js";
export const productsRouter = express.Router()

productsRouter.get('/', productsController.getAllProducts)

productsRouter.get('/:pid', productsController.findOne)

productsRouter.delete('/:pid', productsController.delete)

productsRouter.post('/', uploader.single('file'), productsController.create)

productsRouter.put('/:pid', productsController.update)
