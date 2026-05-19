const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    'string.empty': 'Nazwa użytkownika jest wymagana.',
    'string.min': 'Nazwa użytkownika musi mieć co najmniej 3 znaki.',
    'string.max': 'Nazwa użytkownika może mieć maksymalnie 30 znaków.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.empty': 'Hasło jest wymagane.',
    'string.min': 'Hasło musi mieć co najmniej 8 znaków.',
  }),
  roleName: Joi.string().valid('worker', 'managing director', 'admin').required().messages({
    'string.empty': 'Rola użytkownika jest wymagana.',
    'any.only': 'Nieprawidłowa rola użytkownika.',
  }),
  firstName: Joi.string().min(2).max(50).allow(null, '').messages({
    'string.empty': 'Imię jest wymagane.',
    'string.min': 'Imię musi mieć co najmniej 2 znaki.',
    'string.max': 'Imię może mieć maksymalnie 50 znaków.',
  }),
  lastName: Joi.string().min(2).max(50).allow(null, '').messages({
    'string.empty': 'Nazwisko jest wymagane.',
    'string.min': 'Nazwisko musi mieć co najmniej 2 znaki.',
    'string.max': 'Nazwisko może mieć maksymalnie 50 znaków.',
  }),
  email: Joi.string().email().allow(null, '').messages({
    'string.email': 'Nieprawidłowy format adresu email.',
  }),
});

const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Nazwa użytkownika jest wymagana.',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Hasło jest wymagane.',
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
