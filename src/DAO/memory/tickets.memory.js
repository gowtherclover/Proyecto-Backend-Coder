import fs from "fs";
import { __dirname } from "../../config.js";
import path from "path";
import { faker } from "@faker-js/faker";

class TicketsFS{
    constructor() {
        this.path = path.join(__dirname, "/data/tickets.json");
        this.readTicketsFromFile()
    }

    async readTicketsFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')

            if (data) {
                this.Tickets = JSON.parse(data)
            } else {
                this.Tickets = []
            }
        } catch (error) {
            console.error(error)
            this.Tickets = []
        }
    }

    async saveTicketsToFile() {
        try {
            const data = JSON.stringify(this.Tickets)
            await fs.promises.writeFile(this.path, data)
        } catch (error) {
            console.error(error)
        }
    }

    getAll(){
        return this.Tickets
    }

    getOne({tid}) {
        const ticket = this.Tickets.find(id => id._id === tid);
        return ticket
    }

    async create({code,date,email,productsPidAmount,totalPrice}) {
        try {
            const ticketCreated = {
                _id: faker.database.mongodbObjectId(),
                code,
                purchase_datetime:date,
                purchaser:email,
                products:productsPidAmount,
                totalPrice
            };

            this.Tickets.push(ticketCreated);
            await this.saveTicketsToFile();

            return ticketCreated;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }
}

export const TicketsMemory = new TicketsFS()