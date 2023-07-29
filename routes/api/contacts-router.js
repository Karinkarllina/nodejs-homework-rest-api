import express from "express";
import contactsService from "../../models/contacts-controller.js";
import { isEmptyBody, isValidId, authenticate } from '../../middlewars/index.js';
import contactsSchemas from '../../shema/contacts-schemas.js';
import { validateBody } from '../../decorators/index.js'






const contactsRouter = express.Router();

contactsRouter.use(authenticate); 


contactsRouter.get('/', contactsService.listContacts);

contactsRouter.get('/:id', isValidId, contactsService.getContactById)

contactsRouter.post('/', isEmptyBody, validateBody(contactsSchemas.contactsAddSchema), contactsService.addContact);

contactsRouter.delete('/:id', isValidId, contactsService.removeContact);

contactsRouter.put('/:id', isValidId, isEmptyBody, validateBody(contactsSchemas.contactsAddSchema), contactsService.updateContact);

contactsRouter.patch('/:id/favorite', isValidId, isEmptyBody, validateBody(contactsSchemas.contactsUpdateFavoriteShema), contactsService.updateStatusContact);

export default contactsRouter;