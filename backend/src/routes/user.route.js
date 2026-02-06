import express from "express";

import * as userController from "../controllers/user.controller.js";
import { validateRegister, validateLogin, validateRefreshToken } from "../middlewares/validation/validateUser.js";
import authToken from "../middlewares/authToken.js";
import { USER_ROUTE } from "../constants/ROUTES.js";

const route = express.Router();

const { register, login, refreshToken, userData, update } = USER_ROUTE;

route.post(`${register}`, validateRegister, userController.registerUserData);
route.post(`${login}`, validateLogin, userController.loginUser);
route.post(`${refreshToken}`, validateRefreshToken, userController.refreshToken);
route.get(`${userData}`, authToken, userController.currentUserData);
route.put(`${update}`, authToken, userController.updateUserData);

export default route;
