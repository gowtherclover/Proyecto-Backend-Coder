import { Server } from "socket.io";
import { MessagesModel } from "../DAO/models/messages.model.js";

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
}
