import express from "express";
import { validateBody } from '../../decorators/index.js';
import usersSchemas from '../../shema/users-schemas.js';
import authController from "../../models/auth-controller.js";
import {authenticate} from "../../middlewars/index.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(usersSchemas.registerSchema), authController.register);

authRouter.post("/login", validateBody(usersSchemas.loginSchema), authController.login);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/signout", authenticate, authController.signout);

export default authRouter;