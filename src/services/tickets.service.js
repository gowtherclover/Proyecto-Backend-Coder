
import TicketDTO from "../DAO/DTO/ticket.dto.js";
import { Tickets,Carts, Users, Products } from "../DAO/factory.js";
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

    async getOne({tid}){
        const ticket = await Tickets.getOne({tid});
        const ticketDTO = new TicketDTO(ticket)
        
        const completeTicket = await completeProducts(ticketDTO)
        
        async function completeProducts(dto) {
            const completedProducts = [];
        
            for (const product of dto.products) {
                const productData = await Products.findOne(product.pid);
                const completedProduct = {
                    pid: productData,
                    amount: product.amount
                };
                completedProducts.push(completedProduct);
            }
        
            const completedDto = {
                ...dto,
                products: completedProducts
            };
        
            return completedDto;
        }
        return completeTicket
    }

    async create({cid, email}) {
        try {
            const code = Date.now() + Math.floor(Math.random() * 10000 + 1);
            const date = new Date()
            
            const cartFinder = await Carts.findOne(cid)

            if(cartFinder.products.length > 0){
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
            }else{return null}

        } catch (error) {
            console.error('Error creating Ticket:', error);
            throw error;
        }
    }
}

export const ticketService = new TicketService()