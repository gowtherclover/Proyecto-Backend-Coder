//@ts-check
import { Schema, model } from "mongoose";

const productSchema = new Schema(
    {
    pid: { type: String, required: true },
    quantity: { type: Number, required: true },
    },
    { _id: false }
);

const cartSchema = new Schema({
    products: { type: [productSchema], required: true },
});


/* const studentSchema = new Schema({
    first_name: String,
    last_name: String,
    email: String,
    gender: String,
    courses: {
        type: [
            {
            course: {
                type: Schema.Types.ObjectId,
                ref: 'courses',
            },
            },
        ],
        default: [],
        },
    });
    studentSchema.pre('findOne', function () {
        this.populate('courses.course');
    });
    
    studentSchema.pre('find', function () {
        this.populate('courses.course');
    }); */
export const CartModel = model("carts", cartSchema);
