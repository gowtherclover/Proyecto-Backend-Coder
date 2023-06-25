import { Long } from "mongodb";
import { UserModel } from "../DAO/models/users.model.js";

class UserService{
    async getOne(username){
        const users = await UserModel.findOne({username:username},{password:false,__v:false});
        return users
    }

    async create({ username, email, password }) {
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
                const userCreated = await UserModel.create({ username, email, password });
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
            const user = await UserModel.findOne({ username: username, password: password });
            if (!user) {
                return false;
            } else {
                return true;
            }
        } catch (error) {
            console.error('Error authenticating user:', error);
            throw error;
        }
    }
}

export const userService = new UserService()