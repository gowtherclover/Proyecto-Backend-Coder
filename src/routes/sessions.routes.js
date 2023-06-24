import express from "express";
import { userService } from "../services/users.service.js";
export const sessionsRouter = express.Router()

sessionsRouter.get('/login', (req,res)=>{
    try{
        return res.render('login')
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "error", msg: "Error getting the products" })
    }
    
})

sessionsRouter.get('/register', (req,res)=>{
    try{
        return res.render('register')
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "error", msg: "Error getting the products" })
    }
    
})

sessionsRouter.post('/register', async (req,res)=>{
    try{
        const {username,email,password} = req.body
        const newUser = await userService.create({username,email,password})

        if (newUser) {
            return res.redirect('/views/products')
        }else{
            res.send('username or mail already exists')
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "error", msg: "Error getting the products" })
    }
    
})