const Joi = require('joi');

const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const postSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string(),
  author: Joi.string().required(), 
  // createdAt: Joi.string().required(), 
  // status: joi.string().required(),
});

module.exports = { signupSchema, loginSchema, postSchema };