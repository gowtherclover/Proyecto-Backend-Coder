
import { Tickets,Carts, Users } from "../DAO/factory.js";
import { cartService } from "./carts.service.js";

class TicketService{
    async getAll() {
        try {
            let allTickets = await Tickets.getAll()
            return allTickets;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to get all Tickets");
        }
    }


    async create({cid, email}) {
        try {
            const code = Date.now() + Math.floor(Math.random() * 10000 + 1);
            const date = new Date()
            
            const cartFinder = await Carts.findOne(cid)

            const productsPidAmount = cartFinder.products.map(product => ({
                pid: product.pid._id,
                amount: product.quantity
            }))

            const totalPrice = cartFinder.products.reduce((total, product) => {
                return total + (product.quantity * product.pid.price);
            }, 0);

            const ticketCreated = await Tickets.create({code,date,email,productsPidAmount,totalPrice});

            cartFinder.products.forEach(async (product) => {
                const quantity = product.quantity;
                for (let i = 0; i < quantity; i++) {
                    await cartService.deleteProd({ cid: cid, pid: product.pid });
                }
            });

            await Users.updateTicketUser({tid:ticketCreated._id,email})

            return ticketCreated;
        } catch (error) {
            console.error('Error creating Ticket:', error);
            throw error;
        }
    }
}

export const ticketService = new TicketService()