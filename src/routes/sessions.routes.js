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

sessionsRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const isAuthenticated = await userService.authenticate(username, password);

        if (isAuthenticated) {
            req.session.user = username;
            return res.redirect('/views/products');
        } else {
            const path = req.path
            return res.render('errorLogin',{msg:'Incorrect username or password',path});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", msg: error });
    }
});

sessionsRouter.get('/register', (req,res)=>{
    try{
        return res.render('register')
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "error", msg: error })
    }
    
})

sessionsRouter.post('/register', async (req,res)=>{
    try{
        const {username,email,password} = req.body
        const newUser = await userService.create({username,email,password})

        if (newUser) {
            return res.redirect('/views/products')
        }else{
            const path = req.path
            return res.render('errorLogin',{msg:'Username or mail already exists',path});
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "error", msg: error })
    }
})

sessionsRouter.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
        return res.json({ status: 'Logout ERROR', body: err })
        }
        res.send('Logout ok!')
    })
})

sessionsRouter.get('/profile',async (req,res)=>{
    try{
        const dataUser = await userService.getOne(req.session.user)
        const {username,email,role} = dataUser

        return res.render('profile',{username,email,role})
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "error", msg: error })
    }
})