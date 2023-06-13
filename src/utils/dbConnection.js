import { connect } from "mongoose";
import { faker } from '@faker-js/faker'
import { UserModel } from '../DAO/models/users.model.js';
import { StudentsModel } from "../DAO/models/students.model.js";
import { CoursesModel } from "../DAO/models/courses.model.js";

export async function connectMongo() {
    try {
        await connect(
            "mongodb+srv://96enzoaguilar:FWSadN7jvyazwmaC@backendcoder.uzv2r7b.mongodb.net/?retryWrites=true&w=majority",
            {
                dbName: "test",
            }
        );
        console.log("plug to mongo!");

        /* let student = await StudentsModel.findOne({ _id: '6477e9884df43016016bf2fa' });
            student.courses.push({ course: '6477e9ed7ebf0ed7c12a3a16' });
            let res = await StudentsModel.updateOne({ _id: '6477e9884df43016016bf2fa' }, student); */

            /* let res2 = await StudentsModel.find({});
            console.log(JSON.stringify(res2, null, 4)); */

            /*  let student = await StudentsModel.find({});
            console.log(JSON.stringify(student, null, 2)); */
            /* let student = await StudentsModel.findOne({ _id: '6477bde9d7627dafa9ea28b2' }); .populate('courses.course');
            console.log(JSON.stringify(student, null, 2)); */

            /* let student = await StudentsModel.findOne({ _id: '648261a9af6ae1b2daaa4821' });
            student.courses.push({ course: '648263083218ab59ffadfc28' });
            let res = await StudentsModel.updateOne({ _id: '648261a9af6ae1b2daaa4821' }, student);
            console.log(res); */

            /* let todosLosEstudiantes = await StudentsModel.find({_id:'648261a9af6ae1b2daaa4821'}) *//* .populate('courses.course') */
            /* console.log(JSON.stringify(todosLosEstudiantes,null,2)); */

            /* const created = CoursesModel.create({
            topics: ['software', 'python'],
            students: [],
            title: 'python',
            description: 'wonderfull python course',
            dificulty: 10,
            professor: 'pepe',
            }); */

            /* const created = StudentsModel.create({
            first_name: 'guillermo',
            last_name: 'profe',
            email: 'g@g.com',
            gender: 'masculino',
            courses: [],
            }); */

            /* let res = await UserModel.find({ lastName: 'Rico' }).explain('executionStats');
            console.log(res); */

            /* (async () => {
            const users = [];
            for (let i = 0; i < 4000; i++) {
                users.push({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                });
            }

            try {
                await UserModel.insertMany(users);
                console.log('Inserted', users.length, 'users');
            } catch (error) {
                console.error('Error en insert many:', error);
            }
            })(); */

            const res = await UserModel.paginate({},{limit:5, page:2})
            console.log(res);
    } catch (e) {
        console.log(e);
        throw "can not connect to the db";
    }
}