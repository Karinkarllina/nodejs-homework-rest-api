import express from "express";

import contactsService from "../../models/contacts-controller.js";
// import { HttpError } from '../../helpers/index.js';
import { isEmptyBody, isValidId } from '../../middlewars/index.js';
import contactsSchemas from '../../shema/contacts-schemas.js';
import { validateBody } from '../../decorators/index.js'



// const validateBody = schema => {
//     const func = (req, res, next) => {
//         const { error } = schema.validate(req.body);
//         if (error) {
//             next(HttpError(400, error.message));
//         }
//         next();
//     }

//     return func;
// }

const contactsRouter = express.Router();

contactsRouter.get('/', contactsService.listContacts);

contactsRouter.get('/:id', isValidId, contactsService.getContactById)

contactsRouter.post('/', isEmptyBody, validateBody(contactsSchemas.contactsAddSchema), contactsService.addContact);

contactsRouter.delete('/:id', isValidId, contactsService.removeContact);

contactsRouter.put('/:id', isValidId, isEmptyBody, validateBody(contactsSchemas.contactsAddSchema), contactsService.updateContact);

contactsRouter.patch('/:id/favorite', isValidId, isEmptyBody, validateBody(contactsSchemas.contactsUpdateFavoriteShema), contactsService.updateStatusContact);

export default contactsRouter;