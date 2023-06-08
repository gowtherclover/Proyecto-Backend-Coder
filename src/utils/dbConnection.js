import { connect } from "mongoose";

export async function connectMongo() {
    try {
        await connect(
            "mongodb+srv://96enzoaguilar:FWSadN7jvyazwmaC@backendcoder.uzv2r7b.mongodb.net/?retryWrites=true&w=majority",
            {
                dbName: "ecommerce",
            }
        );
        console.log("plug to mongo!");
    } catch (e) {
        console.log(e);
        throw "can not connect to the db";
    }
}