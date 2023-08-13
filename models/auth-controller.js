import User from "./user.js";
import { ctrlWrapper } from "../decorators/index.js";
import { HttpError, sendEmail, createVerifyEmail } from "../helpers/index.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";
import gravatar from "gravatar"
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";
import { error } from "console";
import { nanoid } from "nanoid";


const { JWT_SECRET } = process.env;

const avatarPath = path.resolve("public", "avatars");



const register = async (req, res) => {
    const {email, password, subscription} = req.body;
    const user = await User.findOne({email});
    if(user) {
        throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationCode = nanoid();

    const avatarUrl = gravatar.url(email);
    
    const newUser = await User.create({...req.body, password: hashPassword, verificationCode, subscription, avatarUrl});

    const verifyEmail = createVerifyEmail({ email, verificationCode });

    await sendEmail(verifyEmail);
    
    res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription,
        avatarUrl: newUser.avatarUrl,
    })
   
}

const verify = async (req, res) => {
    const { verificationCode } = req.params;
    const user = await User.findOne({ verificationCode });
    if (!user) {
        throw HttpError(404, "Email not found");
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verificationCode: "" });

    res.json({
        message: "Verify success"
    })
}

const resendVerifyEmail = async(req, res)=> {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(404, "Missing required field email");
    }

    if(user.verify) {
        throw HttpError(400, "Verification has already been passed")
    }

    const verifyEmail = createVerifyEmail({email, verificationCode: user.verificationCode});

    await sendEmail(verifyEmail);

    res.json({
        message: "Verification email sent"
    })
}


const login = async (req, res) => { 

    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "Email or password invalid");
    }

     if (!user.verify) {
        throw HttpError(401, "Email not verify");
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
    verify: ctrlWrapper(verify),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
}

