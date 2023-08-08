import { MongooseTicketModel } from "./mongoose/tickets.mongoose.js";
class TicketsModel{
    async getAll() {
        try {
            let allTickets = await MongooseTicketModel.find({}, { __v: false });
            return allTickets;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to get all Tickets");
        }
    }

    async getOne({tid}){
        const Tickets = await MongooseTicketModel.findOne({_id:tid},{__v:false});
        return Tickets
    }

    async create({code,date,email,productsPidAmount,totalPrice}) {
        try {
            const ticketCreated = await MongooseTicketModel.create({
                code,
                purchase_datetime:date,
                purchaser:email,
                products:productsPidAmount,
                totalPrice}
            );
            return ticketCreated;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
}

export const TicketsMongo = new TicketsModel()