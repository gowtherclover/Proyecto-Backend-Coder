import { MongooseUserModel } from "./mongoose/users.mongoose.js";
class UsersModel{
    async getAll() {
        try {
            let allUsers = await MongooseUserModel.find({}, { __v: false });
            return allUsers;
        } catch (error) {
            console.log(error);
            throw new Error("Unable to get all users");
        }
    }

    async getOne(username){
        const users = await MongooseUserModel.findOne({username:username},{__v:false});
        return users
    }

    async create( {first_name,last_name,username, email,age, password,cart_ID} ) {
        try {
            const userCreated = await MongooseUserModel.create({
                first_name,
                last_name,
                username,
                email,
                age,
                password,
                cart_ID}
            );
            return userCreated;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async update({id, first_Name, last_Name, email}){
        const userUpdated = await MongooseUserModel.updateOne(
            { _id: id },
            { first_Name, last_Name, email }
        );
        return userUpdated
    }

    async delete({id}){
        const userDeleted = await MongooseUserModel.deleteOne({ _id: id });
        return userDeleted
    }

    async updateTicketUser({tid,email}){

        await MongooseUserModel.findOneAndUpdate(
            { email:email },
            { $push: { tickets: tid } }
        )

    }
}

export const UsersMongo = new UsersModel()