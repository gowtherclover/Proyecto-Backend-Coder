import express from 'express'
export const ChatRouter = express.Router()

ChatRouter.get('/', (req,res)=>{
    return res.status(200).render("chat", {});
})