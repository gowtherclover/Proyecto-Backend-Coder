import express from "express";
import { userService } from "../services/users.service.js";
import { usersController } from "../controllers/users.controller.js";
export const usersRouter = express.Router();

usersRouter.get("/", usersController.getAll);

usersRouter.post("/", usersController.create);

usersRouter.put("/:id", usersController.update);

usersRouter.delete("/:id", usersController.delete);
