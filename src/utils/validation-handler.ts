/* eslint-disable no-useless-escape */
import { NextFunction } from 'express';
import Joi from 'joi';

export async function validateUpdateUser(data: any, next: NextFunction) {
  const schema = Joi.object({
    id: Joi.string().required().label('id'),
    email: Joi.string().label('Email'),
    first_name: Joi.string().label('First Name'),
    last_name: Joi.string().label('Last Name'),
    phone: Joi.string().label('Phone'),
    dob: Joi.string().label('Date of Birth'),
    country_id: Joi.number().label('Country Id'),
  });
  // validate request
  const { error } = schema.validate(data);

  if (error != null) {
    // strip string of double quotes
    error.message = error.message.replace(/\"/g, '');
    next(error);
  }
}

export async function validateGetAllUser(data: any, next: NextFunction) {
  const schema = Joi.object({
    id: Joi.string().label('id'),
    page: Joi.string().label('Page'),
    size: Joi.string().label('Size'),
  });
  // validate request
  const { error } = schema.validate(data);

  if (error != null) {
    // strip string of double quotes
    error.message = error.message.replace(/\"/g, '');
    next(error);
  }
}
