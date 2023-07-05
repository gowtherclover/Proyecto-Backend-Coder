import express from "express";
import { userService } from "../services/users.service.js";
import passport from "passport";
export const sessionsRouter = express.Router()

sessionsRouter.get('/', async (req,res)=>{
    try{
        if (req.session.user) {
            const dataUser = await userService.getOne(req.session.user.username)
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

sessionsRouter.get('/login', (req,res)=>{
    try{
        return res.render('login')
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "error", msg: error })
    }
    
})


sessionsRouter.post('/login', passport.authenticate('login', { failureRedirect: '/error?msg=Incorrect%20username%20or%20password' }), (req, res) => {
    try {
        req.session.user = { _id: req.user._id, username: req.user.username, email: req.user.email, first_name: req.user.first_name, last_name: req.user.last_name, role: req.user.role,cart_ID:req.user.cart_ID };
        return res.redirect('/views/products');
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

sessionsRouter.post('/register', passport.authenticate('register', { failureRedirect: '/error?msg=Username%or%mail%already%exists' }), (req,res)=>{
    try{
        req.session.user = { _id: req.user._id, username: req.user.username, email: req.user.email, first_name: req.user.first_name, last_name: req.user.last_name, role: req.user.role,cart_ID:req.user.cart_ID };
        return res.redirect('/views/products');
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
        const dataUser = await userService.getOne(req.session.user.username)
        const {first_name,last_name,username, email,age,role} = dataUser

        return res.render('profile',{first_name,last_name,username, email,age,role})
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "error", msg: error })
    }
})

sessionsRouter.get('/github',passport.authenticate('github',{scope: ['user:email']}))

sessionsRouter.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/error?msg=Username%or%mail%already%exists'}), (req,res)=>{
    try{
        req.session.user = { _id: req.user._id, username: req.user.username, email: req.user.email, first_name: req.user.first_name, last_name: req.user.last_name, role: req.user.role,cart_ID:req.user.cart_ID };
        return res.redirect('/views/products');
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: "error", msg: error })
    }
    
})

sessionsRouter.get('/error', (req,res)=>{
    try{
        const { msg } = req.query;
        return res.render('errorLogin', { msg });
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