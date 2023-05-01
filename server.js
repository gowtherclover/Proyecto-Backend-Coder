class ProductManager{
    constructor(){
        this.products = []
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

    addProducts(title,description,price,thumbnail,code,stock){
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log('Faltan campos obligatorios')
            return false
        }
        
        if (this.products.some(prod => prod.code === code)) {
            console.log('El código del producto ya existe')
            return false
        }
        
        let idMax = this.getIdMax()
        const prod = { id: idMax, title, description, price, thumbnail, code, stock }
        
        this.products.push(prod)
        return true
    }

    getProductById(id) {
        const product = this.products.find(prod => prod.id === id)
        if (!product) {
            console.log('Producto no encontrado')
            return null
        }
        return product
    }
}

const product = new ProductManager()
product.addProducts('Conjunto Night Fire','Conjunto de top rojo y short negro',5199,'/imgX/conjuntoX.jpg','CO1R',10)
product.addProducts('Short','short negro',5199,'/imgX/shortX.jpg','SH1B',10)
product.addProducts('Calza Floral','Calza Verde ',5199,'/imgX/CalzaX.jpg','CA1G',10)

console.log(product.getProducts());

const product1 = product.getProductById(1)

console.log(product1)