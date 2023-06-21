import { Server } from "socket.io";
import { MessagesModel } from "../DAO/models/messages.model.js";
import { ProductModel } from "../DAO/models/products.model.js";
import { CartModel } from "../DAO/models/carts.model.js";

export function connectSocketServer(httpServer ){
    const socketServer = new Server(httpServer);

    socketServer.on("connection", (socket) => {
        socket.on("msg_front_back", async (msg) => {
            try {
                await MessagesModel.create(msg)
            } catch (error) {
                console.log(error);
            }
            
            try {
                const msgs = await MessagesModel.find({})
                socketServer.emit("msg_back_front", msgs);
            } catch (error) {
                console.log(error);
            }
        });
    });

    socketServer.on('connection',(socket)=>{
        socket.on('prod_front_back',(allProd)=>{
            socketServer.emit('prod_back_front', allProd)
        })
    })
    
    socketServer.on('connection', (socket) => {
        socket.on('viewProd_front_back', async (productId) => {
            await ProductModel.updateOne({ _id: productId.pid }, { $inc: { stock: -1 } });
            const newStock = await ProductModel.findOne({_id:productId.pid})
            socketServer.emit('viewProd_back_front', newStock);
        });
    })
    
    socketServer.on('connection', (socket) => {
        socket.on('viewCart_front_back', async (cartId) => {
            const updateCart = await CartModel.findOne({ _id: cartId.cid }, { __v: false });
            socketServer.emit('viewCart_back_front', updateCart.products);
        });
    })

    socketServer.on('connection', (socket) => {
        socket.on('increaseCart_front_back', async (productId) => {
            await ProductModel.updateOne({ _id: productId.pid }, { $inc: { stock: -1 } });
        });
    })

    socketServer.on('connection', (socket) => {
        socket.on('decreaseCart_front_back', async (productId) => {
            await ProductModel.updateOne({ _id: productId.pid }, { $inc: { stock: +1 } });
        });
    })
}
