import express from "express";
import { userService } from "../services/users.service.js";
export const sessionsRouter = express.Router()

sessionsRouter.get('/', async (req,res)=>{
    try{
        if (req.session.user) {
            const dataUser = await userService.getOne(req.session.user)
            const {first_name} = dataUser
            const existUser = true

            return res.render('index',{existUser,first_name})
        }else{
            return res.render('index')
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "error", msg: error })
    }
})

sessionsRouter.get('/login', async (req,res)=>{
    try{
        return res.render('login')
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "error", msg: error })
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
        const {first_name,last_name,username, email,age, password} = req.body
        const newUser = await userService.create({first_name,last_name,username, email,age, password})

        if (newUser) {
            req.session.user = username;
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

sessionsRouter.get('/logout',authenticate, (req, res) => {
    req.session.destroy(err => {
        if (err) {
        return res.json({ status: 'Logout ERROR', body: err })
        }
        return res.redirect('/login');
    })
})

sessionsRouter.get('/profile',authenticate,async (req,res)=>{
    try{
        const dataUser = await userService.getOne(req.session.user)
        const {first_name,last_name,username, email,age,role} = dataUser

        return res.render('profile',{first_name,last_name,username, email,age,role})
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "error", msg: error })
    }
})

function authenticate(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next()
}