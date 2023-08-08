import { ticketService } from "../services/tickets.service.js";

class TicketsController {
    getAll = async (req, res) => {
        try {
            const tickets = await ticketService.getAll();
            return res.status(200).json({
                status: "success",
                msg: "listado de usuarios",
                payload: tickets,
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
            const tickets = await ticketService.getOne(req.params.ticketname);
            return res.status(200).json({
                status: "success",
                msg: "listado de un usuario",
                payload: tickets,
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
            const cid = req.params.cid

            const email = req.session.user.email
            await ticketService.create({cid,email});
            return res.redirect('/views/products');
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
            const {first_name,last_name,ticketname, email,age, password} = req.body;
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
                const ticketUpdated = await ticketService.update({id, first_name, last_name, email}
                );
                if (ticketUpdated.matchedCount > 0) {
                    return res.status(201).json({
                        status: "success",
                        msg: "ticket update",
                        payload: {},
                    })
                }else{
                    return res.status(404).json({
                        status: "error",
                        msg: "ticket not found",
                        payload: {},
                    });
                }
            } catch (error) {
                return res.status(500).json({
                    status: "error",
                    msg: "db server error while updating ticket",
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
            await ticketService.delete({ id });
            return res.status(200).json({
                status: "success",
                msg: "ticket deleted",
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

export const ticketsController = new TicketsController();
