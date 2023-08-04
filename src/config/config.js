import dotenv from 'dotenv';

dotenv.config();

export default {
    persistence: process.env.PERSISTENCE,
    MONGO_URL: process.env.MONGO_URL,
    PORT: 8080,
};