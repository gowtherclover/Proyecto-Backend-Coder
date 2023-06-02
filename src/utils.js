import multer from "multer";
import path from "path"
import {fileURLToPath} from "url"
import { connect } from "mongoose";
export const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)


const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, "./public");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});


export async function connectMongo() {
    try {
      await connect(
        "mongodb+srv://96enzoaguilar:FWSadN7jvyazwmaC@backendcoder.uzv2r7b.mongodb.net/?retryWrites=true&w=majority"
      );
      console.log("plug to mongo!");
    } catch (e) {
      console.log(e);
      throw "can not connect to the db";
    }
  }

export const uploader = multer({ storage });

