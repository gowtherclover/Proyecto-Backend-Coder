const socket = io();

const addToCartButtons = document.getElementsByClassName('addToCart');
const stockQuantity = document.getElementsByClassName('stockQuantity');
let clickedButton = null;
const divId = document.getElementsByClassName('divId')
const quantityCart = document.getElementsByClassName('quantityCart')
const totalCart = document.getElementById('totalCart')
const emptyCart = document.getElementById('emptyCart')
const buy = document.getElementById('buy')

Array.from(addToCartButtons).forEach((button) => {
    button.addEventListener('click', (event) => {
        const pid = event.target.value;
        clickedButton = event.target
        addToCart(pid)
    });
})
const cid = '6490a2f0afa56fc505b2ea74';

if (emptyCart) {
    emptyCart.addEventListener('click', () => {
        deleteCart();
    });
}

if (buy) {
    buy.addEventListener('click', () => {
        deleteCart();
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

async function increaseQuantity(pid) {
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

        refreshCart(cid)

    } catch (error) {
        console.error('Error adding product:', error);
    }
}

async function decreaseQuantity(pid){
    try {
        const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error deleting product');
        }

        socket.emit('decreaseCart_front_back', {
            pid: pid
        });

        refreshCart(cid)

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

async function refreshCart(cid){
    socket.emit('viewCart_front_back', {
        cid: cid
    });
    
}

socket.on('viewProd_back_front', async (product) => {
    Array.from(stockQuantity).forEach((element) => {
        const productId = element.getAttribute('data-product-id')

        if (productId == product._id) {
            element.innerHTML=`stock: ${product.stock}`
            clickedButton.disabled = (product.stock === 0)
        }
    })
});

socket.on('viewCart_back_front', async (updateCart) => {
    let total = 0
    Array.from(quantityCart).forEach((element) => {
        const productId = element.getAttribute('data-product-id')

        updateCart.forEach((data)=>{
            
            if (productId == data.pid._id) {
                element.innerHTML=`Cantidad: ${data.quantity}`;

            }
        })
    })

    Array.from(divId).forEach((element) => {
        const blockProd = element.getAttribute('div-id')
        let existsInCart = false;

        updateCart.forEach((data)=>{
            if (blockProd == data.pid._id) {
                existsInCart = true;
            }
        })

        if (!existsInCart) {
            element.remove();
        }
    })

    updateCart.forEach((data)=>{
        total =total + ( data.pid.price * data.quantity )
    })
    totalCart.innerHTML = `$ ${total}`
});

