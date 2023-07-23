import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import Contact from './contact.js';
import { HttpError } from '../helpers/index.js';



export const listContacts  = async (req, res) => {
    const result = await Contact.find({}, "-createdAt -updatedAt");
  res.json(result);
  console.log(result)
}
  

export const getContactById = async (req, res) => {
   const { id } = req.params;
  const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json(result);
}

export const removeContact = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndDelete(id);
    if (!result) {
        throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json({
        message: "Delete success"
    })
}

export const addContact = async (req, res) => {
    const result = await Contact.create(req.body);
    res.status(201).json(result);
}

export const updateContact = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
    if (!result) {
        throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json(result);
}

const updateStatusContact = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
    if (!result) {
        throw HttpError(404, `Not found`);
    }
    res.json(result);
}

export default {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
}