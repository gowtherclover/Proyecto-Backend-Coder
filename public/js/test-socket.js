const socket = io()

const messageInput = document.getElementById('messageInput');
const messageParagraph = document.getElementById('messageParagraph');
const createProductButton = document.getElementById('createProductButton');
const pid = document.getElementById('pid')
const form = document.getElementById('productForm');
const deleteForm = document.getElementById('deleteProdForm');
const fileInput = document.getElementById('thumbnail')

document.addEventListener('DOMContentLoaded', () => {
  getProducts();
});

let thumbnail

fileInput.addEventListener('change', (event) => {
  thumbnail = event.target.files[0];
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const price = document.getElementById('price').value;
  const code = document.getElementById('code').value;
  const stock = document.getElementById('stock').value;
  const category = document.getElementById('category').value;
  const status = document.getElementById('status').value;
  
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('price', price);
  formData.append('code', code);
  formData.append('file', thumbnail);
  formData.append('stock', stock);
  formData.append('category', category);
  formData.append('status', status);
  
  createProduct(formData);
  
  form.reset();
});

deleteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const idProd = pid.value
  deleteProduct(idProd);
  
  deleteForm.reset();
});

async function createProduct(product) {
  try {

    const response = await fetch('/api/products', {
      method: 'POST',
      body: product
    });

    if (!response.ok) {
      throw new Error('Error al crear el producto');
    }

    const data = await response.json();
    console.log('Producto creado:', data);

    getProducts()

  } catch (error) {
    console.error('Error al crear el producto:', error);
  }
}

async function deleteProduct(pid) {
  try {
    const response = await fetch(`/api/products/${pid}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el producto');
    }

    const data = await response.json();
    console.log('Producto eliminado:', data);

    getProducts()

  } catch (error) {
    console.error('Error al eliminar el producto:', error);
  }
}


async function getProducts(){
  try {
    const prodResponse = await fetch('/api/products');

    if (!prodResponse.ok) {
      throw new Error('Error al obtener los productos');
    }

    const allProd = await prodResponse.json();

    socket.emit('msg_front_back', {
      allProd: allProd.data
    });

  } catch (error) {
    console.error('Error al obtener los productos:', error);
  }
}
socket.on('msg_back_front', async (allProd) => {
  messageParagraph.innerHTML=""

  await allProd.allProd.forEach(el => {
    const {id,title,description,price,code,stock,status,thumbnail,category} = el

    let div = document.createElement('div')
    div.innerHTML =`
            <div>
                <h5 class="card-title tipo">${title.toUpperCase()}</h5>

                <p >ID: ${id}</p>
                <p >Descripcion: ${description}</p>
                <p >Precio: ${price}</p>
                <p >Codigo: ${code}</p>
                <p >Stock: ${stock}</p>
                <p >Disponibilidad: ${status}</p>
                <p >imagen: ${thumbnail}</p>
                <p >Categoria ${category}</p>
            </div>
        </div>`;
        
        messageParagraph.appendChild(div)
  });
});


/* messageInput.addEventListener('input', () => {
  const message = messageInput.value;
  socket.emit('msg_front_back', {
    msg: message,
  });
});

socket.on('msg_back_front', (msg) => {
    console.log(msg);
    messageParagraph.textContent = msg.msg;
});
 */