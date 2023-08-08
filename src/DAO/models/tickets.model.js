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

    async getOne(username){
        const Tickets = await MongooseTicketModel.findOne({username:username},{__v:false});
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

    async update({id, first_Name, last_Name, email}){
        const userUpdated = await MongooseTicketModel.updateOne(
            { _id: id },
            { first_Name, last_Name, email }
        );
        return userUpdated
    }

    async delete({id}){
        const userDeleted = await MongooseTicketModel.deleteOne({ _id: id });
        return userDeleted
    }
}

export const TicketsMongo = new TicketsModel()