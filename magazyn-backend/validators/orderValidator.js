const Joi = require('joi');

exports.createOrderSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().positive().required(),
      })
    )
    .min(1)
    .required(),
  dueDate: Joi.date().required(),
});

exports.updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('oczekuje', 'w trakcie', 'odrzucone', 'zrealizowane')
    .required(),
});