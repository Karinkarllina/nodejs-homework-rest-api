import User from "./user.js";
import { ctrlWrapper } from "../decorators/index.js";
import { HttpError } from "../helpers/index.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";
import gravatar from "gravatar"
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";
import { error } from "console";


const { JWT_SECRET } = process.env;

const avatarPath = path.resolve("public", "avatars");



const register = async (req, res) => {
    const {email, password, subscription} = req.body;
    const user = await User.findOne({email});
    if(user) {
        throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const avatarUrl = gravatar.url(email);
    
    const newUser = await User.create({...req.body, password: hashPassword, subscription, avatarUrl});

    
    res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription,
        avatarUrl: newUser.avatarUrl,
    })
   
}

const login = async (req, res) => { 

    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "Email or password invalid");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, "Email or password invalid");
    }

     const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

    await User.findByIdAndUpdate(user._id, {token});
    
            res.json({
        token,
    })
}

const getCurrent = async (req, res) => {
    const {name, email} = req.user;

    res.json({
        name,
        email,
    })
}


const signout = async (req, res) => { 

    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});

    res.json({
        message: "Signout ssucess"
    })
}


const subscription = async (req, res) => {
  const { _id } = req.user;

  const result = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });

  if (!result) {
    throw HttpError(404, `Not found`);
  }

  res.json({ result });
};


const updateAvatar = async (req, res) => { 
    const { _id } = req.user;
    console.log( _id)
    const {path: oldPath, filename} = req.file;
    const newPath = path.join(avatarPath, filename);

        Jimp.read(oldPath)
        .then(image => {
            return image
            .resize(250, 250) 
            .write(newPath);
        })
        .catch(error => {
            console.error(error);
        }); 
    
    await fs.rename(oldPath, newPath);

    const avatarUrl = path.join("avatars", filename);

    await User.findByIdAndUpdate(_id, { avatarUrl });
    
    
    res.status(201).json(avatarUrl);

}



export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
    subscription: ctrlWrapper(subscription),
    updateAvatar: ctrlWrapper(updateAvatar),
}