const Joi = require('joi');

exports.createProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(255).allow('', null),
  quantity: Joi.number().integer().min(0).required(),
  status: Joi.string().valid('wolne', 'zajęte').required(),
  locationId: Joi.number().integer().positive().required(),
});

exports.updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(255).allow('', null),
  quantity: Joi.number().integer().min(0).required(),
  status: Joi.string().valid('wolne', 'zajęte').required(),
  locationId: Joi.number().integer().positive().required(),
});