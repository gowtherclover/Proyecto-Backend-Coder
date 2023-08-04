import config from '../config/config.js';
import mongoose from 'mongoose';

export let Users;
switch (config.persistence) {
    case 'MONGO':
        console.log('Mongo connect');
        mongoose.connect(config.MONGO_URL);

        const { UsersMongo } = await import('./models/users.model.js');
        Users = UsersMongo;

        break;
    case 'MEMORY':
        console.log('Persistence with Memory');
        const { UsersMemory } = await import('./memory/users.memory.js');
        Users = UsersMemory;

        break;
    default:
        break;
}