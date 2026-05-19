const Joi = require('joi');

const createOrderSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().required().messages({
          'number.base': 'ID produktu musi być liczbą.',
          'any.required': 'ID produktu jest wymagane.',
        }),
        quantity: Joi.number().integer().min(1).required().messages({
          'number.base': 'Ilość musi być liczbą.',
          'number.min': 'Ilość musi być co najmniej 1.',
          'any.required': 'Ilość jest wymagana.',
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.base': 'Lista produktów musi być tablicą.',
      'array.min': 'Zamówienie musi zawierać co najmniej jeden produkt.',
    }),
  dueDate: Joi.date().required().messages({
    'date.base': 'Data realizacji musi być poprawną datą.',
    'any.required': 'Data realizacji jest wymagana.',
  }),
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('w trakcie', 'zrealizowane').required().messages({
    'string.empty': 'Status zamówienia jest wymagany.',
    'any.only': 'Nieprawidłowy status zamówienia.',
  }),
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema,
};
