import fs from "fs";
import { __dirname } from "../../config.js";
import path from "path";
import { faker } from "@faker-js/faker";

class UsersFS{
    constructor() {
        this.path = path.join(__dirname, "/data/users.json");
        this.readUsersFromFile()
    }

    async readUsersFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')

            if (data) {
                this.Users = JSON.parse(data)
            } else {
                this.Users = []
            }
        } catch (error) {
            console.error(error)
            this.Users = []
        }
    }

    async saveUsersToFile() {
        try {
            const data = JSON.stringify(this.Users)
            await fs.promises.writeFile(this.path, data)
        } catch (error) {
            console.error(error)
        }
    }

    getAll(){
        return this.Users
    }

    getOne(username) {
        const user = this.Users.find(user => user.username === username);
        return user
    }

    async create({ first_name, last_name, username, email, age, password, cart_ID }) {
        try {
            const newUser = {
                _id: faker.database.mongodbObjectId(),
                first_name,
                last_name,
                username,
                email,
                age,
                password,
                cart_ID
            };

            this.Users.push(newUser);
            await this.saveUsersToFile();

            return newUser;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async update({id, first_name, last_name, email}) {
        try {
            const userIndex = this.Users.findIndex((user) => user._id === id);
            console.log(id);
            if (userIndex !== -1) {
                this.Users[userIndex].first_name = first_name;
                this.Users[userIndex].last_name = last_name;
                this.Users[userIndex].email = email;

                await this.saveUsersToFile();
            }

            return this.Users[userIndex];
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    async delete({ id }) {
        try {
            const userIndex = this.Users.findIndex((user) => user._id === id);

            if (userIndex !== -1) {
                const userDeleted = this.Users.splice(userIndex, 1)[0];
                await this.saveUsersToFile();
                return userDeleted;
            } else {
                throw new Error('User not found');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    async updateTicketUser({ tid, email }) {
        console.log('tid: '+tid);
        console.log('mail: '+email);
        const userIndex = this.Users.findIndex(user => user.email === email);
        if (userIndex !== -1) {
            this.Users[userIndex].tickets.push({ tid });
        } else {
            throw new Error("User not found");
        }
    }
}

export const UsersMemory = new UsersFS()