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

    getIDs(){
        let IDsProd=[]
        this.products.forEach(el => {
            IDsProd.push(el.id)
        });

        return(IDsProd);
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
        console.log(product);
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.path || !product.code || !product.stock || !product.category || !product.status) {
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

    async addToCart(product) {

        const idMax = this.getIdMax()
        const prod = { id: idMax, ...product }
        this.products.push(prod)
        await this.saveProductsToFile()
        return true
    }

    async addProductToCart(cid, product) {
        const productIndex = this.products.findIndex((prod) => parseInt(prod.id) === parseInt(cid))
        const newProduct = { id:product.id }

        if (productIndex !== -1) {
            const cartObtained = this.products[productIndex];
            const prodIndex = cartObtained.products.findIndex((el) => parseInt(el.id) === parseInt(product.id))
            if (prodIndex !== -1) {
                cartObtained.products[prodIndex].quantity++
            }
            else{
                newProduct.quantity = 1
                cartObtained.products.push(newProduct)
            }
        } else {
            console.log('Carrito para agregar producto no encontrado')
            return false
        }
        
        await this.saveProductsToFile()
        return true;

    }

    getProductById(id) {
        const product = this.products.find(prod => parseInt(prod.id) === parseInt(id))
        if (!product) {
            console.log('Producto buscado por ID no encontrado')
            return false
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
        const productIndex = this.products.findIndex((prod) => parseInt(prod.id) === parseInt(id));
        if (productIndex === -1) {
            console.log('Producto para eliminar no encontrado');
            return false;
        }

        const filePath = this.products[productIndex].path

        fs.unlink(filePath, (err) => {
            if (err) {
            console.error('Error al eliminar el archivo:', err)
            return false
            }

            this.products.splice(productIndex, 1)
            this.saveProductsToFile()
            return true
        });
        }
}