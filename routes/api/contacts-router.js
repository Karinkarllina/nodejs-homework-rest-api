import express from "express";
import Joi from "joi";

import contactsService from "../../models/contacts.js";
import { HttpError } from '../../helpers/index.js';


const moviesAddSchema = Joi.object({
  name: Joi.string().required().messages({
        "any.required": `"name" must be exist`,
    }),
  email: Joi.string().required().messages({
        "any.required": `"email" must be exist`,
    }),
  phone: Joi.string().required().messages({
        "any.required": `"phone" must be exist`,
    }),
})


const contactsRouter = express.Router()

contactsRouter.get('/', async (req, res, next) => {
  try { 
    const result = await contactsService.listContacts();
    res.json(result);  
  } catch (error) {
      next(error);
  }

})

contactsRouter.get('/:contactId', async (req, res, next) => {
  try { 
    const { contactId } = req.params;
    const result = await contactsService.getContactById(contactId);
    if (!result) {
      throw HttpError(404, `Movie with id=${contactId} not found`);
    }
    res.json(result);
  } catch (error) {
        next(error);
    } 
})

contactsRouter.post('/', async (req, res, next) => {
  try {
    const { error } = moviesAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message)
    }
    const result = await contactsService.addContact();
  res.json(result);
  } catch (error) {
        next(error);
    } 
})

contactsRouter.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsService.removeContact();
    if (!result) {
            throw HttpError(404, `Movie with id=${contactId} not found`);
    }
    res.json({ message: "Contact deleted" });
  } catch (error) {
        next(error);
    }  
})

contactsRouter.put('/:contactId', async (req, res, next) => {

  try {
    const { error } = moviesAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message)
    }
      const { contactId } = req.params;
      const result = await contactsService.updateContact(contactId, req.body);
      if (!result) {
        throw HttpError(404, `Movie with id=${contactId} not found`);
      }
      res.json(result)
  } catch (error) {
        next(error);
  };
  
})

export default contactsRouter;
