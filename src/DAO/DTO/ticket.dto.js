export default class TicketDTO {
    constructor(ticket) {
        this._id = ticket._id.toString();
        this.code = ticket.code;
        this.purchase_datetime = this.formatDate(ticket.purchase_datetime);
        this.purchaser = ticket.purchaser;
        this.products = ticket.products
        this.totalPrice = ticket.totalPrice;
    }

    formatDate(date) {
        const options = {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC"
        };
        return date.toLocaleString("en-GB", options).replace(",", "");
    }
}
