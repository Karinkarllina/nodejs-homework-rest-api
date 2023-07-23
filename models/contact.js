import { Schema, model } from "mongoose";

const contsctSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  }, {versionKey: false, timestamps: true});


// contsctSchema.post("save", (error, data, next) => {
//   error.status = 400;
//   next();
// });  ----- если не прошло валидацию? пример с датой релиза.

const Contact = model("contact", contsctSchema);


export default Contact;