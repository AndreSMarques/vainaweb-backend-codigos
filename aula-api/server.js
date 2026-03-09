require('dotenv').config()
const express = require('express');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8002;

let cadastros = [];
let proximoID = 1;


function emailValido(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

function telefoneValido(telefone) {
  const regex = /^[0-9]{10,11}$/;
  return regex.test(telefone);
};

function mensagemValida(mensagem) {
  const regex = /^[\s\S]{0,500}$/;
  return regex.test(mensagem);
};


function validarCadstro (req, res, next) {
  const {nome, email, telefone, mensagem} = req.body;

  if (!nome || nome.length < 3) {
    return res.status(400).json({
      error: 'Nome obrigatorio! Deve conter pelo menos 3 caracteres'
    });
  }

  if(!email || !emailValido(email)) {
    return res.status(400).json({
      error: 'Email Inválido'
    });
  }

  if(!telefone || !telefoneValido(telefone)) {
    return res.status(400).json({
      error: 'telefone Inválido. Deve conter 11 numeros!'
    });
  }

  if(!mensagem || !mensagemValida(mensagem)) {
    return res.status(400).json({
      error: 'Mensagem Inválido.'
    });
  }

  next();
};

app.get('/cadastros', (req, res) => {
  res.status(200).json(cadastros);
});

app.post('/cadastros', validarCadstro, (req, res) => {
  const {nome, email, telefone, mensagem} = req.body;

  const novoCadastro = {
    id: proximoID++,
    nome, 
    email,
    telefone,
    mensagem: mensagem || null
  };

  cadastros.push(novoCadastro);

  res.status(201).json({
    mensagem: 'cadastro criado com sucesso',
    cadastros: novoCadastro
  });

});

app.get('/', (req, res) => {
  res.send("Hello darkaness my old friend");
});

app.listen(PORT, () =>{
  console.log(`Application running in port ${PORT}`);
});
