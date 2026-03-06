const express = require('express');

const app = express();
const PORT = 3000;

//Exemplo basico de um Middleware de "log"
function myLog(req, res, next){
  console.log('A request was made.');
  next();
}
app.use(myLog);

//Exemplo de um Middleware de autenticação
function checkAccess(req, res, next) {
  const authorized = false;
  if(!authorized){
    return res.send('Acess denied!')
  }
  next();
}
//Rota para testar o Middleware de autenticação
app.get('/restricted', checkAccess, (req, res) =>{
  res.send('Welcome to the restricted area.');
});

// Exemplo basico de um Middleware de "log" trazendo informações com o req
function logger(req, res, next) {
  console.log(`${req.method} - ${req.url}`);
  next();
}
app.use(logger);

app.get('/', (req, res) =>{
  res.send('Hello Darkaness My Old Friend! Ive Come To Talk With You Again!!');
});

app.listen(PORT, ()=>{
  console.log(`Server is running in ${PORT}`);
});