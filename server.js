/* const http = require("http")

const server = http.createServer((req,res)=>{
    console.log("hora " + Date.now());
    res.end("hola mundo")
})

server.listen(8080,()=>{
    console.log("Server is running on http://localhost:8080");
}) */
const express = require("express")
//importamos el productmanager que esta en otro archivo

const app = express()
const PORT = 4000

app.use(express.urlencoded({ extended: true }))

app.get('/products',(req,res)=>{
    res.json()
})

let animales=[
    {id:1,animal:'leon',caracteristica:'4 patas'},
    {id:2,animal:'lobo',caracteristica:'4 patas'},
    {id:3,animal:'perro',caracteristica:'4 patas'},
]

app.get('/animales/:id',(req,res)=>{
    const id=req.params.id
    const animalEncontrado = animales.find((c)=>c.id == id)
    res.json(animalEncontrado)
})

app.get('/animales',(req,res)=>{
    const query = req.query
    console.log(query);
    res.send('animal X')
})


app.listen(PORT,()=>{
    console.log(`escuchando en el servidor puerto ${PORT}`);
})