import { UserModel } from "../DAO/models/users.model.js";
import { createHash, isValidPassword } from "../utils/hash.js";

class UserService{
    async getAll() {
        try {
            let allUsers = await UserModel.find({}, { __v: false });
            return allUsers;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to get all users");
        }
    }

    async getOne(username){
        const users = await UserModel.findOne({username:username},{password:false,__v:false});
        return users
    }

    async create({ first_name,last_name,username, email,age, password }) {
        try {
            const findUser = await UserModel.findOne({
                $or: [
                    { username: username },
                    { email: email }
                ]
            });

            if (findUser) {
                return false;
            } else {
                const userCreated = await UserModel.create({ first_name,last_name,username, email,age, password:createHash(password) });
                return userCreated;
            }
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async update({id, firstName, lastName, email}){
        const userUpdated = await UserModel.updateOne(
            { _id: id },
            { firstName, lastName, email }
        );
        return userUpdated
    }

    async delete({id}){
        const userDeleted = await UserModel.deleteOne({ _id: id });
        return userDeleted
    }

    async authenticate(username, password) {
        try {
            const user = await UserModel.findOne({ username: username});
            if (user && isValidPassword(password,user.password)) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error authenticating user:', error);
            throw error;
        }
    }
}

export const userService = new UserService()