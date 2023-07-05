import fetch from 'node-fetch';
import passport from "passport";
import GitHubStrategy from 'passport-github2';
import local from "passport-local";
import { UserModel } from "../DAO/models/users.model.js";
import { createHash, isValidPassword } from "../utils/hash.js";
import { env } from './env.js';
import { CartModel } from '../DAO/models/carts.model.js';
const LocalStrategy = local.Strategy;

export function iniPassport() {
    passport.use(
        "login",
        new LocalStrategy(
            async (username, password, done) => {
                try {
                    const user = await UserModel.findOne({ username: username });
                    if (!user) {
                        console.log("User Not Found with username " + username);
                        return done(null, false);
                    }
                    if (!isValidPassword(password, user.password)) {
                        console.log("Invalid Password");
                        return done(null, false);
                    }

                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );

    passport.use(
        "register",
        new LocalStrategy({
                passReqToCallback: true
            },
            async (req,username,password,done) => {
                try {
                    const { age, email, first_name, last_name } = req.body;
                    let user = await UserModel.findOne({ username: username });
                    const newCart= await CartModel.create({products: []});
                    if (user) {
                        console.log("User already exists");
                        return done(null, false);
                    }

                    const newUser = {
                        first_name,
                        last_name,
                        username,
                        email,
                        age,
                        password: createHash(password),
                        cart_ID: newCart._id,
                    };
                    let userCreated = await UserModel.create(newUser);
                    console.log("User Registration succesful");
                    return done(null, userCreated);
                } catch (e) {
                    console.log("Error in register");
                    console.log(e);
                    return done(e);
                }
            }
        )
    );

    passport.use(
        'github',
        new GitHubStrategy(
            {
                clientID: 'Iv1.d97fc43e7af535bb',
                clientSecret: env.SECRET_GITHUB,
                callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
            },
            async (accesToken, _, profile, done) => {
                try {
                    const res = await fetch('https://api.github.com/user/emails', {
                        headers: {
                            Accept: 'application/vnd.github+json',
                            Authorization: 'Bearer ' + accesToken,
                            'X-Github-Api-Version': '2022-11-28',
                        },
                    });
                    const emails = await res.json();
                    const emailDetail = emails.find((email) => email.verified == true);

                    if (!emailDetail) {
                        return done(new Error('cannot get a valid email for this user'));
                    }
                    profile.email = emailDetail.email;

                    let user = await UserModel.findOne({ email: profile.email });
                    const newCart= await CartModel.create({products: []});
                    if (!user) {
                        const newUser = {
                            first_name: profile.displayName || 'noname',
                            last_name: 'nolast',
                            username:profile.username,
                            email: profile.email,
                            age:'noage',
                            password: 'nopass',
                            cart_ID: newCart._id,
                        };
                        let userCreated = await UserModel.create(newUser);
                        console.log('User Registration succesful');
                        return done(null, userCreated);
                    } else {
                        console.log('User already exists');
                        return done(null, user);
                    }
                } catch (e) {
                    console.log('Error en auth github');
                    console.log(e);
                    return done(e);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById(id);
        done(null, user);
    });
}
