const express = require('express');
const pool =  require('./config/db');
const validarUsuarios = require('./validacao/usuario');
const validarPost = require('./validacao/post');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>Wellcome to Orkut2.0</h1>')
});

function formatarData(data){
  return new Data(data).toLocaleString("pt-BR", {
    timeZone:"America/Bahia"
  });   
}

app.get('/postagens', async(req, res) => {
  try{
    const resultado = await pool.query(`
        SELECT
            usuarios.id AS usuarios_id,
            usuarios.nome,
            post.conteudo,
            post.criado_em,
            post.id AS post_id
        FROM post
        JOIN usuarios
        ON post.usuario_id = usuarios.id
        ORDER BY post.criado_em DESC
      `);
      const dados = resultado.rows.map((post) => ({
        ...post,
        criado_em: formatarData(post.criado_em),
      }));
    res.json(resultado.rows);
  }catch(error){
    res.status(500).json({erro: 'Error ao buscar postagens'});
    console.log(error);
  }
});

app.post("/posts", validarPost, async (req, res) => {
  try {
    const { titulo, conteudo, usuario_id } = req.body;
    const resultado = await pool.query(
      `
      INSERT INTO post (titulo, conteudo, usuario_id)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [titulo, conteudo, usuario_id],
    );
    res.status(201).json({
      mensagem: "Post criado com sucesso",
      post: resultado.rows[0],
    });
  } catch (erro) {
    res.status(500).json({
      erro: "Erro ao criar postagem",
    });
  }
});

app.put("/post/:id", async (req, res) => {
  try{
    const { id } = req.params;
    const { titulo, conteudo } = req.body
    const resultado = await pool.query(
      `UPDATE post SET titulo=$1, conteudo=$2 WHERE id=$3 RETURNING *`,
      [titulo, conteudo, id],
    );

    res.json(resultado.rows[0]);

  }catch (erro) {
    res.status(500).json({
      erro: "Erro ao atualizar postagem",
    });
  }
})

app.delete("/post/:id", async (req, res) => {
  try{
    const { id } = req.params;
    const resultado = await pool.query(
      `DELETE FROM post WHERE id=$1 RETURNING *`,
      [id],
    );

    res.json(resultado.rows[0]);

  }catch (erro) {
    res.status(500).json({
      erro: "Erro ao deletar postagem",
    });
  }
})

app.post("/usuarios", validarUsuarios, async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const resultado = await pool.query(`
            INSERT INTO usuarios (nome, email, senha)
            VALUES ($1, $2, $3
            RETURNING *
        `, [nome, email, senha]);
        res.status(201).json({ mensagem: "Usuário criado com sucesso", usuario: resultado.rows[0] });
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao criar usuário" });
    }
});

module.exports = app;