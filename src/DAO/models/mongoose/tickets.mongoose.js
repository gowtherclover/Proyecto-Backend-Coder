import { Schema, model } from 'mongoose';

const TicketSchema = new Schema({
    code: { type: String, required: true, trim: true,},
    purchase_datetime: {type: Date, required: true},
    purchaser: {type: String, required: true},
    products: [{
        pid: { type: Schema.Types.ObjectId, ref: 'products', required: true },
        amount: { type: Number, required: true },
        _id:false
    }],
    totalPrice: {type: Number, required: true},
});

export const MongooseTicketModel = model('Tickets', TicketSchema);

