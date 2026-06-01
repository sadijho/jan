const Joi = require('joi');

exports.createWarehouseSchema = Joi.object({
  code: Joi.string().min(1).max(50).required(),
  description: Joi.string().max(255).allow('', null),
});