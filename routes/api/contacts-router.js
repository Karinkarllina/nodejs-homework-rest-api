import express from "express";
import Joi from "joi";

import contactsService from "../../models/contacts.js";
import { HttpError } from '../../helpers/index.js';
import {isEmptyBody, isValidId } from '../../middlewars/index.js';



const contactsAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `"name" must be exist`,
  }),
  email: Joi.string().required().messages({
    "any.required": `"email" must be exist`,
  }),
  phone: Joi.string().required().messages({
    "any.required": `"phone" must be exist`,
  }),
  favorite: Joi.boolean(),
});


const contactsUpdateFavoriteShema = Joi.object({
  favorite: Joi.boolean().required()
});


const validateBody = schema => {
    const func = (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            next(HttpError(400, error.message));
        }
        next();
    }

    return func;
}

const contactsRouter = express.Router();

contactsRouter.get('/', contactsService.listContacts);

contactsRouter.get('/:id', isValidId, contactsService.getContactById)

contactsRouter.post('/', isEmptyBody, validateBody(contactsAddSchema), contactsService.addContact);

contactsRouter.delete('/:id', isValidId, contactsService.removeContact);

contactsRouter.put('/:id', isValidId, isEmptyBody, validateBody(contactsAddSchema), contactsService.updateContact);

contactsRouter.patch('/:id/favorite', isValidId, isEmptyBody, validateBody(contactsUpdateFavoriteShema), contactsService.updateStatusContact);

export default contactsRouter;