const Joi = require('joi');

exports.createManufacturerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  country: Joi.string().max(100).allow('', null),
  contactEmail: Joi.string().email().max(150).allow('', null),
  phone: Joi.string().max(30).allow('', null),
});

exports.updateManufacturerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  country: Joi.string().max(100).allow('', null),
  contactEmail: Joi.string().email().max(150).allow('', null),
  phone: Joi.string().max(30).allow('', null),
});