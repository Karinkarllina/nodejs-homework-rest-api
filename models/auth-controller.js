import User from "./user.js";

import { ctrlWrapper } from "../decorators/index.js";

import { HttpError } from "../helpers/index.js";

import bcrypt from "bcrypt";

import "dotenv/config";

import jwt from "jsonwebtoken";


const { JWT_SECRET } = process.env;



const register = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user) {
        throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    
    const newUser = await User.create({...req.body, password: hashPassword});

    
    res.status(201).json({
        email: newUser.email,
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

export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
}