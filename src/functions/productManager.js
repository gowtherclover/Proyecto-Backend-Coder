import fs from "fs";
export class ProductManager{
    constructor(path) {
        this.path = path
        this.readProductsFromFile()
    }

    async readProductsFromFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            if (data) {
                this.products = JSON.parse(data)
            } else {
                this.products = []
            }
        } catch (error) {
            console.error(error)
            this.products = []
        }
    }

    async saveProductsToFile() {
        try {
            const data = JSON.stringify(this.products)
            await fs.promises.writeFile(this.path, data)
        } catch (error) {
            console.error(error)
        }
    }
    
    getProducts(){
        return this.products
    }

    getIdMax(){
        let idMax = 0
        this.products.forEach(prod => {
            if(prod.id > idMax){
                idMax=prod.id
            }
        });
        idMax++
        return idMax
    }

    async addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock || !product.category || !product.status) {
            console.log('Faltan campos obligatorios');
            return false
        }
    
        if (this.products.some((prod) => prod.code === product.code)) {
            console.log('El código del producto ya existe');
            return false
        }
    
        const idMax = this.getIdMax()
        const prod = { id: idMax, ...product }
        this.products.push(prod)
        await this.saveProductsToFile()
        return true
    }

    getProductById(id) {
        const product = this.products.find(prod => parseInt(prod.id) === parseInt(id))
        if (!product) {
            console.log('Producto buscado por ID no encontrado')
            return null
        }
        return product
    }

    async updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex((prod) => parseInt(prod.id) === parseInt(id))
        if (productIndex === -1) {
            console.log('Producto para actualizar no encontrado')
            return false
        }
        const product = { ...this.products[productIndex], ...updatedFields }
        this.products[productIndex] = product
        await this.saveProductsToFile()
        return true;
    }
    
    async deleteProduct(id) {
        const productIndex = this.products.findIndex((prod) => parseInt(prod.id) === parseInt(id))
        if (productIndex === -1) {
            console.log('Producto para eliminar no encontrado')
            return false;
        }
        this.products.splice(productIndex, 1)
        await this.saveProductsToFile()
        return true;
    }
}