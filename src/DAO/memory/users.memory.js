import fs from "fs";
import { __dirname } from "../../config.js";
import path from "path";

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

    getOne(username){
        let IDsProd=[]
        this.Users.forEach(el => {
            IDsProd.push(el.id)
        });

        return(IDsProd);
    }

    getIdMax(){
        let idMax = 0
        this.Users.forEach(prod => {
            if(prod.id > idMax){
                idMax=prod.id
            }
        });
        idMax++
        return idMax
    }

    async create({first_name,last_name,username, email,age, password,cart_ID}) {
        console.log(product);
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.path || !product.code || !product.stock || !product.category || !product.status) {
            console.log('Faltan campos obligatorios');
            return false
        }
    
        if (this.Users.some((prod) => prod.code === product.code)) {
            console.log('El código del producto ya existe');
            return false
        }
    
        const idMax = this.getIdMax()
        const prod = { id: idMax, ...product }
        this.Users.push(prod)
        await this.saveUsersToFile()
        return true
    }

    async addToCart(product) {

        const idMax = this.getIdMax()
        const prod = { id: idMax, ...product }
        this.Users.push(prod)
        await this.saveUsersToFile()
        return true
    }

    async addProductToCart(cid, product) {
        const productIndex = this.Users.findIndex((prod) => parseInt(prod.id) === parseInt(cid))
        const newProduct = { id:product.id }

        if (productIndex !== -1) {
            const cartObtained = this.Users[productIndex];
            const prodIndex = cartObtained.Users.findIndex((el) => parseInt(el.id) === parseInt(product.id))
            if (prodIndex !== -1) {
                cartObtained.Users[prodIndex].quantity++
            }
            else{
                newProduct.quantity = 1
                cartObtained.Users.push(newProduct)
            }
        } else {
            console.log('Carrito para agregar producto no encontrado')
            return false
        }
        
        await this.saveUsersToFile()
        return true;

    }

    getProductById(id) {
        const product = this.Users.find(prod => parseInt(prod.id) === parseInt(id))
        if (!product) {
            console.log('Producto buscado por ID no encontrado')
            return false
        }
        return product
    }

    async updateProduct(id, updatedFields) {
        const productIndex = this.Users.findIndex((prod) => parseInt(prod.id) === parseInt(id))
        if (productIndex === -1) {
            console.log('Producto para actualizar no encontrado')
            return false
        }
        const product = { ...this.Users[productIndex], ...updatedFields }
        this.Users[productIndex] = product
        await this.saveUsersToFile()
        return true;
    }
    
    async deleteProduct(id) {
        const productIndex = this.Users.findIndex((prod) => parseInt(prod.id) === parseInt(id));
        if (productIndex === -1) {
            console.log('Producto para eliminar no encontrado');
            return false;
        }

        const filePath = this.Users[productIndex].path

        fs.unlink(filePath, (err) => {
            if (err) {
            console.error('Error al eliminar el archivo:', err)
            return false
            }

            this.Users.splice(productIndex, 1)
            this.saveUsersToFile()
            return true
        });
    }
}

export const UsersMemory = new UsersFS()