import express from "express";
import passport from "passport";
import { sessionsController } from "../controllers/sessions.controller.js";
import { authenticate } from "../middlewares/main.js";
export const sessionsRouter = express.Router()

sessionsRouter.get('/', sessionsController.get)

sessionsRouter.get('/login', sessionsController.getLogin)


sessionsRouter.post('/login', passport.authenticate('login', { failureRedirect: '/error?msg=Incorrect%20username%20or%20password' }), sessionsController.postLogin);

sessionsRouter.get('/register', sessionsController.getRegister)

sessionsRouter.post('/register', passport.authenticate('register', { failureRedirect: '/error?msg=Username%20or%20mail%20already%20exists' }), sessionsController.postRegister)

sessionsRouter.get('/logout',authenticate, sessionsController.getLogout)

sessionsRouter.get('/current',authenticate, sessionsController.getCurrent)

sessionsRouter.get('/github',passport.authenticate('github',{scope: ['user:email']}))

sessionsRouter.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/error?msg=Username%20or%20mail%20already%20exists'}), sessionsController.getGithubCallback)

sessionsRouter.get('/error', sessionsController.getError)
