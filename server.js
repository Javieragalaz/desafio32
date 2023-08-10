const { getPosts, addPost, altPost, deletePost, addLikes } = require('./query');


//MIDDLEWARES
const express = require('express');

const app = express();

app.listen(3001, () => {
  console.log('servidor en el puerto 3001')
})

var bodyParser = require('body-parser')

const cors = require('cors');

app.use(cors());

app.use(express.json())

app.use(express.static('public'))

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

//RUTA RAÍZ
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`)
})

//OBTENER POSTS DESDE EL CLIENTE
app.get("/posts", async(req,res) =>{
  const posts = await getPosts()
  res.json(posts)
})

// AGREGAR Y ALMACENAR NUEVO REGISTRO
app.post("/posts", async (req, res) => {
    try {
      console.log('req.body', req.body)
      const { titulo, url, descripcion } = req.body
      const post = await addPost(titulo, url, descripcion)
      res.send(post)
    } catch (error) {
      console.log(error)
    }
})

// MODIFICAR REGISTROS
app.put("/posts/:id", async (req, res) => {
  const { id } = req.params
  const { description } = req.query
 
  try {
    await altPost(description, id)
    res.send("El post ha sido modificado correctamente")
  } 
    catch ({ code, message }) {
    res.status(code).send(message)
  }
})

// DAR LIKE
app.put("/posts/like/:id", async (req, res) => {
  const { id } = req.params;
  const likes = await addLikes(id);
  res.send({ likes });
})

// ELIMINAR POST A TRAVÉS DE ID
app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;

  await deletePost(id)
  res.send("Post eliminado correctamente");
});


