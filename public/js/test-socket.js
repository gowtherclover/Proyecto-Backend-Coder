const socket = io()

const messageInput = document.getElementById('messageInput');
const messageParagraph = document.getElementById('messageParagraph');
const createProductButton = document.getElementById('createProductButton');
const pid = document.getElementById('pid')
const form = document.getElementById('productForm');
const deleteForm = document.getElementById('deleteProdForm');
const fileInput = document.getElementById('thumbnail')
const getPID = document.getElementById('getPID');
const updForm = document.getElementById('updForm')
const updateProdForm = document.getElementById('updateProdForm')

document.addEventListener('DOMContentLoaded', async () => {
  await getProducts();
});

let thumbnail
let allProd = []

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

updateProdForm.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const updTitle = document.getElementById('updTitle').value;
  const updDescription = document.getElementById('updDescription').value;
  const updPrice = document.getElementById('updPrice').value;
  const updCode = document.getElementById('updCode').value;
  const updStock = document.getElementById('updStock').value;
  const updCategory = document.getElementById('updCategory').value;
  const updStatus = document.getElementById('updStatus').value;
  
  const productData = {
    title: updTitle,
    description: updDescription,
    price: updPrice,
    code: updCode,
    stock: updStock,
    category: updCategory,
    status: updStatus
  };

  updateProduct(getPID, productData);
  prodSelection()
  updateProdForm.reset();
});

getPID.addEventListener('change', prodSelection)

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

    await getProducts()

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

    await getProducts()

  } catch (error) {
    console.error('Error al eliminar el producto:', error);
  }
}

async function updateProduct(getPID, product) {
  try {

    const response = await fetch(`/api/products/${getPID.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    });

    if (!response.ok) {
      throw new Error('Error al modificar el producto');
    }

    const data = await response.json();
    console.log('Producto modificado:', data);

    await getProducts()

  } catch (error) {
    console.error('Error al modificar el producto:', error);
  }
}

async function getProducts(){
  try {
    const prodResponse = await fetch('/api/products');

    if (!prodResponse.ok) {
      throw new Error('Error al obtener los productos');
    }

    const prods = await prodResponse.json();
    allProd= prods.data

    getIDs()

    socket.emit('msg_front_back', {
      allProd: allProd
    });

  } catch (error) {
    console.error('Error al obtener los productos:', error);
  }
}

function getIDs(){
  let IDsProd=[]
  allProd.forEach(el => {
      IDsProd.push(el.id)
  });
  
  getPID.innerHTML = '<option value="">ID</option>';

  IDsProd.forEach((id) => {
    const option = document.createElement('option');
    option.value = id;
    option.text = id;
    getPID.appendChild(option);
  });
}

function prodSelection() {
  const selectedID = this.value;
  if (!selectedID) {
    console.log('No se selecciono un ID correspondiente');
    if (updForm.classList.contains('show')) {
      updForm.classList.add('hidden');
      updForm.classList.remove('show')
    }
  }else{
    const selectedProduct = allProd.find((product) => parseInt(product.id) === parseInt(selectedID));
  
    if (updForm.classList.contains('hidden')) {
      updForm.classList.add('show');
      updForm.classList.remove('hidden')
    }
  
    document.getElementById('updTitle').value = selectedProduct.title;
    document.getElementById('updDescription').value = selectedProduct.description;
    document.getElementById('updPrice').value = selectedProduct.price;
    document.getElementById('updCode').value = selectedProduct.code;
    document.getElementById('updStock').value = selectedProduct.stock;
    document.getElementById('updCategory').value = selectedProduct.category;
  }
}

socket.on('msg_back_front', async (allProd) => {
  messageParagraph.innerHTML=""

  await allProd.allProd.forEach(el => {
    const {id,title,description,price,code,stock,status,thumbnail,category} = el

    let div = document.createElement('div')
    div.innerHTML =`
            <div class='prods'>
                <h5>${title.toUpperCase()}</h5>

                <p>ID: ${id}</p>
                <p>Descripcion: ${description}</p>
                <p>Precio: ${price}</p>
                <p>Codigo: ${code}</p>
                <p>Stock: ${stock}</p>
                <p>Disponibilidad: ${status}</p>
                <p>imagen: <a class="prods__link" href="${thumbnail}" target="_blank">${title}</a></p>
                <p>Categoria: ${category}</p>
            </div>
        </div>`;
        
        messageParagraph.appendChild(div)
  });
});