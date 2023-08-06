//import { cartsModel } from "../DAO/models/carts.model.js";
//import { UsersDAO } from "../DAO/models/users.model.js";
import { Users,Carts } from "../DAO/factory.js";
import { createHash } from "../utils/hash.js";

class UserService{
    async getAll() {
        try {
            let allUsers = await Users.getAll()
            return allUsers;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to get all users");
        }
    }

    async getOne(username){
        const users = await Users.getOne(username);
        return users
    }

    async create({ first_name,last_name,username, email,age, password }) {
        try {
            const findUser = await Users.getOne(username)

            if (findUser) {
                return false;
            } else {
                const newCart= await Carts.createCart();

                const userCreated = await Users.create({ 
                    first_name,
                    last_name,
                    username,
                    email,
                    age,
                    password:createHash(password),
                    cart_ID: newCart._id });
                return userCreated;
            }
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async update({id, first_name, last_name, email}){
        const userUpdated = await Users.update({id, first_name, last_name, email})
        return userUpdated
    }

    async delete({id}){
        const userDeleted = await Users.delete({id});
        return userDeleted
    }
}

export const userService = new UserService()