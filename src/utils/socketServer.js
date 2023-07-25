import { Server } from "socket.io";
import { MessagesModel } from "../DAO/models/messages.model.js";
import { cartService } from "../services/carts.service.js";
import { prodService } from "../services/products.service.js";

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
            let pid = productId.pid
            await prodService.updateOneProd({pid, quantity:-1});
            const newStock = await prodService.findOne(pid)
            socketServer.emit('viewProd_back_front', newStock);
        });
    })
    
    socketServer.on('connection', (socket) => {
        socket.on('viewCart_front_back', async (IDs) => {
            const updateCart = await cartService.findOne(IDs.cid);

            const existsInCart = !updateCart.products.some((data) => data.pid._id.toString() === IDs.pid);

            socketServer.emit('viewCart_back_front', updateCart.products,IDs,existsInCart);
        });
    })

    socketServer.on('connection', (socket) => {
        socket.on('increaseCart_front_back', async (productId) => {
            let pid = productId.pid
            await prodService.updateOneProd({pid, quantity:-1});
        });
    })

    socketServer.on('connection', (socket) => {
        socket.on('decreaseCart_front_back', async (IDs) => {
            let pid = IDs.pid
            await prodService.updateOneProd({pid, quantity:1});
            await cartService.deleteProd(IDs.cid,IDs.pid)
        });
    })
}
