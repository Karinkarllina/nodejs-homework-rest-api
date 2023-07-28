import User from "./user.js";

import { ctrlWrapper } from "../decorators/index.js";

import { HttpError } from "../helpers/index.js";

import bcrypt from "bcrypt";


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

    const token = '222.363.gv6664.4567'
    
        res.json({
        token,
    })

    // const payload = {
    //     id: user._id,
    // }
}


export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
}