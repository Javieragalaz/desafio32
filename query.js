// CLASE POOL SOPORTA MULTICONEXIONES Y MEJORA RENDIMIENTO
const { Pool } = require('pg');

// CREDENCIALES POSTGRES
const pool = new Pool ({
    host: 'localhost',
    user: 'javi',
    password: 'admin',
    database: 'likeme',
    port: 5432,
    allowExitOnIdle: true 
});

// OBTENER REGISTROS
const getPosts = async() =>{
  const { rows } = await pool.query('SELECT * FROM posts')
  return rows
}

// CREAR UN REGISTRO
const addPost = async (title, image, description) => {
  const query = 'INSERT INTO posts(id, titulo, img, descripcion, likes) values (DEFAULT, $1, $2, $3, 0)';
  const values = [title, image, description];
  console.log('values', values);
  return await pool.query(query, values);
};

// MODIFICAR POST
const altPost = async (title, id) => {
  const query = "UPDATE posts SET description = $1 WHERE id = $2"
  const values = [description, id]
  const result = await pool.query(query, values)
  
  const { rowCount } = await pool.query(query, values)
  
  if (rowCount === 0) {
    throw { code: 404, message: "Error al modificar el post, el id no existe" }
  }
}

// ELIMINAR POST POR ID
const deletePost = async (id) =>{
  const query = 'DELETE FROM posts WHERE id = $1';
  const result = await pool.query(query, [id]);
  return(result);
}

//CONTADOR DE LIKES
const addLikes = async (id) => {
    try {
        const query = 'UPDATE posts SET likes = likes + 1 WHERE id = $1';
        return await pool.query(query, [id]);

    } catch (error) {
        console.error('Error al incrementar los likes:', error);

        throw error; 
    }
};

module.exports = { 
    getPosts, 
    addPost, 
    altPost, 
    deletePost,
    addLikes };