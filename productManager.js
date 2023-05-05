const fs = require ("fs")
class ProductManager{
    constructor(path) {
        this.path = path
        const products = this.readProductsFromFile();
        this.products = products
    }

    readProductsFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf-8')
            if (data) {
                return JSON.parse(data);
            }
            else{
                return []
            }
            
        } catch (error) {
            console.error(error)
            return [];
        }
    }

    saveProductsToFile() {
        try {
            const data = JSON.stringify(this.products)
            fs.writeFileSync(this.path, data)
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

    addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
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
        this.saveProductsToFile()
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

    updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex((prod) => parseInt(prod.id) === parseInt(id))
        if (productIndex === -1) {
            console.log('Producto para actualizar no encontrado')
            return false
        }
        const product = { ...this.products[productIndex], ...updatedFields }
        this.products[productIndex] = product
        this.saveProductsToFile()
        return true;
    }
    
    deleteProduct(id) {
        const productIndex = this.products.findIndex((prod) => parseInt(prod.id) === parseInt(id))
        if (productIndex === -1) {
            console.log('Producto para eliminar no encontrado')
            return false;
        }
        this.products.splice(productIndex, 1)
        this.saveProductsToFile()
        return true;
    }
}
/* //crear producto
const productManager = new ProductManager('data.json')
const newProduct = {
    title: "Conjunto Night Fire",
    description: "Conjunto de top rojo y short negro",
    price: 5199,
    thumbnail: "/imgX/conjuntoX.jpg",
    code: "CO1RX",
    stock: 10
}
const newProduct2 = {
    title: "Short",
    description: "short negro",
    price: 5199,
    thumbnail: "/imgX/shortX.jpg",
    code: "SH1B",
    stock: 10
}
productManager.addProduct(newProduct)
productManager.addProduct(newProduct2)

//consultarlos
const products = productManager.getProducts()
console.log('Consulta de productos ----------------------')
console.log(products)

//buscar por ID
const product = productManager.getProductById(2)
console.log('Busqueda por ID ----------------------')
console.log(product)

//actualizar producto
const updatedProduct = {
    id: 2,
    title: "Conjunto Actualizado",
    description: "Descripción conjunto actualizada",
    price: 7000,
    thumbnail: "/imgX/shortX.jpg",
    code: "CO1R",
    stock: 5
}
productManager.updateProduct(2, updatedProduct)
console.log('Consulta de productos actualizado ----------------------')
console.log(products)

//eliminar producto
productManager.deleteProduct(1);
console.log('Consulta de productos eliminado ----------------------')
console.log(products) */

module.exports = ProductManager