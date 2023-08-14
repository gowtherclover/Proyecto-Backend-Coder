import { fakerES as faker } from "@faker-js/faker";

export const generateUser = () => {
    const numOfProducts = faker.number.int({ min: 1, max: 10 })
    const products = [];

    for (let i = 0; i < numOfProducts; i++) {
        products.push(generateProduct());
    }

    return {
        _id: faker.database.mongodbObjectId(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        age: faker.number.int({min:18,max:99}).toString(),
        password: faker.internet.password(),
        role: "user",
        cart_ID: faker.database.mongodbObjectId(),
        products,
    };
};

export const generateProduct = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description:faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumnail: faker.image.url(),
        code:faker.string.alpha(5).toUpperCase(),
        stock: faker.number.int(15),
        category: faker.commerce.department(),
        status: faker.datatype.boolean(),
    };
};