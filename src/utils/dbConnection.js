import { connect } from "mongoose";
import config from "../config/config.js";

export async function connectMongo() {
    try {
        await connect(config.MONGO_URL);
        console.log("plug to mongo!");
    } catch (e) {
        console.log(e);
        throw "can not connect to the db";
    }
}