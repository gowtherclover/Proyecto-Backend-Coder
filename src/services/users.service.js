import { cartsModel } from "../DAO/models/carts.model.js";
import { userModel } from "../DAO/models/users.model.js";
import { createHash } from "../utils/hash.js";

class UserService{
    async getAll() {
        try {
            let allUsers = await userModel.getAll()
            return allUsers;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to get all users");
        }
    }

    async getOne(username){
        const users = await userModel.getOne(username);
        return users
    }

    async create({ first_name,last_name,username, email,age, password }) {
        try {
            const findUser = await userModel.getOne(username)

            if (findUser) {
                return false;
            } else {
                const newCart= await cartsModel.createCart();

                const userCreated = await userModel.create({ 
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

    async update({id, firstName, lastName, email}){
        const userUpdated = await userModel.update(id, firstName, lastName, email)
        return userUpdated
    }

    async delete({id}){
        const userDeleted = await userModel.delete(id);
        return userDeleted
    }
}

export const userService = new UserService()