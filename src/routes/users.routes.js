import express from "express";
import { userService } from "../services/users.service.js";
export const usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
  try {
    const users = await userService.getAll()
    return res.status(200).json({
      status: "success",
      msg: "listado de usuarios",
      payload: users,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      payload: {},
    });
  }
});

usersRouter.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    if (!firstName || !lastName || !email) {
      console.log(
        "validation error: please complete firstName, lastname and email."
      );
      return res.status(400).json({
        status: "error",
        msg: "please complete firstName, lastname and email.",
        payload: {},
      });
    }
    const userCreated = await userService.create({ firstName, lastName, email });
    return res.status(201).json({
      status: "success",
      msg: "user created",
      payload: userCreated,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      payload: {},
    });
  }
});

usersRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;
    if (!firstName || !lastName || !email || !id) {
      console.log(
        "validation error: please complete firstName, lastname and email."
      );
      return res.status(404).json({
        status: "error",
        msg: "please complete firstName, lastname and email.",
        payload: {},
      });
    }
    try {
      const userUpdated = await userService.update({ id,firstName, lastName, email }
      );
      if (userUpdated.matchedCount > 0) {
        return res.status(201).json({
          status: "success",
          msg: "user update",
          payload: {},
        })
      }else{
        return res.status(404).json({
          status: "error",
          msg: "user not found",
          payload: {},
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: "error",
        msg: "db server error while updating user",
        payload: {},
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      payload: {},
    });
  }
});

usersRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await userService.delete({ id });
    return res.status(200).json({
      status: "success",
      msg: "user deleted",
      payload: {},
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: "error",
      msg: "something went wrong :(",
      payload: {},
    });
  }
});
