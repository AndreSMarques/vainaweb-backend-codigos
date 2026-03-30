const joi = require('joi');

const postSchema = joi.object({
  titulo: joi.string().min(3).required().messages({
    "string.empty": "titulo é obrigatorio",
    "string.min": "titulo deve ter 3 caracteres",
    "any.require": "titulo é obrigatorio"
  }),
  conteudo: joi.string().min(5).required().messages({
    "string.empty": "conteudo é obrigatorio",
    "string.min": "conteudo deve ter 5 caracteres",
    "any.require": "conteudo é obrigatorio"
  }),
  usuario_id: joi.number().integer().required().messages({
    "string.base": "ID deve ser um numero",
    "string.empty": "ID é obrigatorio",
    "any.require": "ID é obrigatorio"
  })
})

function validarPost(req, res, next) {
  const { error } = postSchema.validate(req.body, {abortEarly:false});
  if(error) {
    console.log(error);
    return res.status(400).json({
      erro: error.details.map(e =>e.message)
    })
  }
  next()
}

module.exports = validarPost;