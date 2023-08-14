import CustomError from "../services/errors/custom-error.js";
import EErros from "../services/errors/enums.js";
import { userService } from "../services/users.service.js";

class UsersController {
    getAll = async (req, res) => {
        try {
            const users = await userService.getAll();
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
    }

    getOne = async (req, res) => {
        try {
            const users = await userService.getOne(req.params.username);
            return res.status(200).json({
                status: "success",
                msg: "listado de un usuario",
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
    }

    create = async (req, res) => {
        try {
            const {first_name,last_name,username, email,age, password} = req.body;
            if (!first_name || !last_name || !email) {

                CustomError.createError({
                    name: "User creation error",
                    cause: `please complete first_name = ${first_name}, last_name = ${last_name} and email = ${email}.`,
                    message: "Error trying to create user",
                    code: EErros.INVALID_TYPES_ERROR,
                });
            }else{
                const userCreated = await userService.create({first_name,last_name,username, email,age, password});
                return res.status(201).json({
                    status: "success",
                    msg: "user created",
                    payload: userCreated,
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
    }

    update = async (req, res) => {
        try {
            const { id } = req.params;
            const {first_name,last_name,username, email,age, password} = req.body;
            if (!first_name || !last_name || !email || !id) {
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
                const userUpdated = await userService.update({id, first_name, last_name, email}
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
    }

    delete = async (req, res) => {
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
    }
}

export const usersController = new UsersController();
