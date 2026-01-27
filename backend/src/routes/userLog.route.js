import express from "express";

import * as userLogController from "../controllers/userlog.controller.js";
import { validateUserLogByType, validateUserLogsById, validateDeleteUserLogById } from "../middlewares/validation/validateUserLog.js";
import authToken from "../middlewares/authToken.js";

const route = express.Router();

route.get("/", authToken, userLogController.getAllUserLogsADMIN);
route.get("/current", authToken, validateUserLogByType, userLogController.getUserLogByTypeADMIN);
route.get("/user", authToken, validateUserLogsById, userLogController.getUserLogsById);
route.delete("/del/:id", authToken, validateDeleteUserLogById, userLogController.deleteUserLogById);

export default route;
