import config from '../config/config.js';
import mongoose from 'mongoose';

export let Users;
export let Carts;
export let Products;
switch (config.persistence) {
    case 'MONGO':
        console.log('Mongo connect');
        mongoose.connect(config.MONGO_URL);

        const { UsersMongo } = await import('./models/users.model.js');
        Users = UsersMongo;
        const { CartsMongo } = await import('./models/carts.model.js');
        Carts = CartsMongo;
        const { ProductsMongo } = await import('./models/products.model.js');
        Products = ProductsMongo;

        break;
    case 'MEMORY':
        console.log('Persistence with Memory');
        mongoose.connect(config.MONGO_URL);
        const { UsersMemory } = await import('./memory/users.memory.js');
        Users = UsersMemory;
        const { CartsMemory } = await import('./memory/carts.memory.js');
        Carts = CartsMemory
        const { ProductsMemory } = await import('./memory/products.memory.js');
        Products = ProductsMemory

        break;
    default:
        break;
}