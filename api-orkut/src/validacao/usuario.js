const joi = require('joi');

const usuarioSchema = joi.object({
  nome: joi.string().min(3).required().messages({
    "string.empty": "Nome é obrigatorio",
    "string.min": "Nome deve ter pelo menos 3 caracteres",
    "any.require": "Nome é obrigatorio"
  }),
  email: joi.string().email().required().messages({
    "string.empty": "Email é obrigatorio",
    "string.email": "Email deve ser um Email vaildo",
    "any.require": "Email é obrigatorio"
  }),
  senha: joi.string().min(6).required().messages({
    "string.base": "Senha deve ser texto",
    "string.empty": "Senha é obrigatorio",
    "string.min": "Senha deve ter pelo menos 6 caracteres",
    "any.require": "Senha é obrigatorio"
  }),
})

function validarUsuarios(req, res, next) {
  const { error } = usuarioSchema.validate(req.body, {abortEarly:false});
  if(error) {
    console.log(error);
    return res.status(400).json({
      erro: error.details.map(e =>e.message)
    })
  }
  next()
}

module.exports = validarUsuarios;