import * as Joi from 'joi';


export const configValidationSchema = Joi.object({
  JWT_SECRET: Joi.string().required(), // Validate that JWT_SECRET is set
  DATABASE_URL: Joi.string().required(), // Validate the database URL
});
