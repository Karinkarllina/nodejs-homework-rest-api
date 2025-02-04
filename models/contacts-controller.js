import Contact from './contact.js';
import { HttpError } from '../helpers/index.js';
import { ctrlWrapper } from "../decorators/index.js";
import fs from "fs/promises";
import path from "path";

const avatarPath = path.resolve("public", "avatars");

export const listContacts = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10, favorite } = req.query;
    const skip = (page - 1) * limit;
    const result = await Contact.find(favorite ? { owner, favorite } : { owner }, "-createdAt -updatedAt", {skip, limit}).populate("owner", "email subscription");
  res.json(result);
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
    const { _id: owner } = req.user;
    const {path: oldPath, filename} = req.file;
    const newPath = path.join(avatarPath, filename);
    await fs.rename(oldPath, newPath);
    const avatar = path.join("avatars", filename);
    const result = await Contact.create({...req.body, avatar, owner});
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
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
}