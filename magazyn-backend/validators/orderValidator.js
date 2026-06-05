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

  dueDate: Joi.date().optional().allow(null, ''),

  startDate: Joi.date().required(),

  endDate: Joi.date()
    .greater(Joi.ref('startDate'))
    .required()
    .messages({
      'date.greater': 'Data zakończenia musi być późniejsza niż data rozpoczęcia.',
    }),

  assignedTechnicalUserId: Joi.number()
    .integer()
    .positive()
    .required(),

  note: Joi.string()
    .trim()
    .max(1000)
    .allow('', null),
});

exports.updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('oczekuje', 'w trakcie', 'odrzucone', 'zrealizowane')
    .required(),
});