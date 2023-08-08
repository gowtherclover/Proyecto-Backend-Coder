const socket = io();

const addToCartButtons = document.getElementsByClassName('addToCart');
const stockQuantity = document.getElementsByClassName('stockQuantity');
let clickedButton = null;
const divProducts = document.getElementById('productsInCart')
const divId = document.getElementsByClassName('divId')
const quantityCart = document.querySelectorAll('.quantityCart')
const totalElement = document.querySelectorAll ('[total-id]');
const emptyCart = document.getElementById('emptyCart')
const buy = document.getElementById('buy')
const cid = window.cid;

Array.from(addToCartButtons).forEach((button) => {
    button.addEventListener('click', (event) => {
        const pid = event.target.value;
        clickedButton = event.target
        addToCart(pid)
    });
})

if (emptyCart) {
    emptyCart.addEventListener('click', () => {
        deleteCart();
    });
}

if (buy) {
    buy.addEventListener('click', () => {
        createTicket();
    });
}

async function addToCart(pid) {
    try {

        const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error('Error adding product');
        }

        socket.emit('viewProd_front_back', {
            pid: pid
        });

    } catch (error) {
        console.error('Error adding product:', error);
    }
}

async function increaseQuantity(pid,cid) {
    try {

        const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error('Error adding product');
        }

        socket.emit('increaseCart_front_back', {
            pid: pid
        });

        refreshCart(cid,pid)

    } catch (error) {
        console.error('Error adding product:', error);
    }
}

async function decreaseQuantity(pid,cid){
    try {
        const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error deleting product');
        }

        socket.emit('decreaseCart_front_back', {
            cid:cid,
            pid: pid
        });

        refreshCart(cid,pid)

    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

async function deleteCart(){
    try {
        const response = await fetch(`/api/carts/${cid}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error deleting cart');
        }

        refreshCart(cid)

    } catch (error) {
        console.error('Error deleting cart:', error);
    }
}

async function createTicket(){
    try {
        const response = await fetch(`/api/carts/${cid}/purchase`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error('Error creating ticket');
        }

        refreshCart(cid)

    } catch (error) {
        console.error('Error creating ticket:', error);
    }
}

async function refreshCart(cid,pid){
    socket.emit('viewCart_front_back', {
        cid: cid,
        pid: pid
    });
    
}

socket.on('viewProd_back_front', async (product) => {
    Array.from(stockQuantity).forEach((element) => {
        const productId = element.getAttribute('data-product-id')

        if (productId == product._id) {
            element.innerHTML=`stock: ${product.stock}`
            if (product.stock === 0) {
                clickedButton.disabled = true
            }
        }
    })
});

socket.on('viewCart_back_front', async (updateCart,IDs,existsInCart) => {
    let total = 0

    if (updateCart.length !== 0) {
        const productId = IDs.pid;
        const quantityCartId = `${productId}+${IDs.cid}`;
        
        const quantityElement = document.querySelector(`[data-product-id="${quantityCartId}"]`);
    
        if (quantityElement) {
            updateCart.forEach((data)=>{
    
                if (data.pid._id == IDs.pid) {
                    quantityElement.innerHTML = `Cantidad: ${data.quantity}`;
                }
                
                total =total + ( data.pid.price * data.quantity )
            })
            totalElement.forEach((element) =>{
                let totalId = element.getAttribute('total-id')
        
                if (totalId == IDs.cid) {
                    element.innerHTML=''
                    element.innerHTML = `$ ${total}`            
                }
                
            })
        }
    
        const divElement = document.querySelector(`[div-id="${quantityCartId}"]`);
    
        if (existsInCart) {
            console.log('se borrara');
            divElement.remove();
        }
    }else{
        divProducts.innerHTML = '';
        totalElement.forEach((element) =>{
            let totalId = element.getAttribute('total-id')
    
            if (totalId == IDs.cid) {
                element.innerHTML=''
                element.innerHTML = `$ ${total}`            
            }
            
        })
    }
});

function openModal() {
    document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

