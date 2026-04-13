const jwt = require('jsonwebtoken');

const auth = (req, res, nexy) => {
  const token = req.headers.authorization;

  if(!token) {
    return res.status(401).json({
      mensagem: "sem token"
    })
  }
  try {
    const decoded = jswt.verify(token.split("")[1], process.env.JWT_SECRET);

    req.usuario = decoded;
    next()

  }catch(error) {
    return res.status(401).json({
      mensagem: "Token Invaçido"
    })
  }
}

module.exports = auth;