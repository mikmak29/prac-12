import express from "express";

import * as userLogController from "../controllers/userlog.controller.js";
import { validateUserLogByType, validateUserLogsById, validateDeleteUserLogById } from "../middlewares/validation/validateUserLog.js";
import authToken from "../middlewares/authToken.js";
import authRole from "../middlewares/authRole.js";
import { USERLOG_ROUTE } from "../constants/ROUTES.js";

const route = express.Router();

const { admin, current, user, del } = USERLOG_ROUTE;

route.get(`${admin}`, authToken, authRole("Admin"), userLogController.getAllUserLogsADMIN);
route.get(`${current}`, authToken, authRole("Admin"), validateUserLogByType, userLogController.getUserLogByTypeADMIN);
route.get(`${user}`, authToken, authRole("Admin", "Manager", "Client"), validateUserLogsById, userLogController.getUserLogsById);
route.delete(`${del}`, authToken, authRole("Admin"), validateDeleteUserLogById, userLogController.deleteUserLogById);

export default route;
