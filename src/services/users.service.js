import { UserModel } from "../DAO/models/users.model.js";

class UserService{
    async getAll(){
        const users = await UserModel.find(
            {},
            {
                "_id":true,
                "firstName":true,
                "lastName":true,
                "email":true
            }
        );
        
        return users
    }

    async create({firstName, lastName, email}){
        const userCreated = await UserModel.create({ firstName, lastName, email });
        return userCreated
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
}

export const userService = new UserService()