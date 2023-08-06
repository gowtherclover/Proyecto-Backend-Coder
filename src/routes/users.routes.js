import express from "express";
import { usersController } from "../controllers/users.controller.js";
export const usersRouter = express.Router();

usersRouter.get("/", usersController.getAll);

usersRouter.get("/:username", usersController.getOne);

usersRouter.post("/", usersController.create);

usersRouter.put("/:id", usersController.update);

usersRouter.delete("/:id", usersController.delete);
