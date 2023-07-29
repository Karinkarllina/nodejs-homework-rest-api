import { Schema, model } from "mongoose";
import {handleSaveError, validateAtUpdate} from "./hooks.js";


const contsctSchema = new Schema({
    name: {
      type: String,
      match: /^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$/,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
      match: /.+\@.+\..+/,
    },
    phone: {
      type: String,
      match: /^((\+)?(3)?(8)?[- ]?)?(\(?\d{3}\)?[- ]?)?\d{3}[- ]?\d{2}[- ]?\d{2}$/,
    },
    favorite: {
      type: Boolean,
      default: false,
  },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
  },
    
}, { versionKey: false, timestamps: true });
  
contsctSchema.pre("findOneAndUpdate", validateAtUpdate);

contsctSchema.post("save", handleSaveError);
contsctSchema.post("findOneAndUpdate", handleSaveError);


const Contact = model("contact", contsctSchema);


export default Contact;