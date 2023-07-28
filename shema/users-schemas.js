import Joi from "joi";

const registerSchema = Joi.object({
  email: Joi.string().pattern(/.+\@.+\..+/).required(),
  password: Joi.string().min(5).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(/.+\@.+\..+/).required().messages({
    'any.required': "Missing field 'email'",
  }),
  password: Joi.string().min(5).required().messages({
    'any.required': "Missing field 'password'",
  }),
});

export default {
    registerSchema,
    loginSchema,
}