import jwt from "jsonwebtoken";

import User from "../models/user.js";

import {ctrlWrapper} from "../decorators/index.js";

import { HttpError } from "../helpers/index.js";

import "dotenv/config";

const { JWT_SECRET } = process.env;


console.log(JWT_SECRET)




const authenticate = async (req, res, next) => { 

    const {authorization = ""} = req.headers;
    const [bearer, token] = authorization.split(' ');
    if(bearer !== "Bearer") {
        throw HttpError(401, "Not authorized");
    }

     try {
        const {id} = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(id);
        if(!user || !user.token) {
            throw HttpError(401, "Not authorized");
        }
        req.user = user;
        next();
     }
     catch(error) {
        throw HttpError(401, error.message);
     }
}

export default ctrlWrapper(authenticate);