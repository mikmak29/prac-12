import dotenv from 'dotenv';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

import errorHandler from "../utils/errorHandler.js";
import { FILE_NAME } from "../constants/FILE_NAME.js";

dotenv.config();

const { middlewares: { auth_token } } = FILE_NAME;

const authToken = asyncHandler(async (req, res, next) => {
    const authHears = req.headers.authorization;
    const token = authHears && authHears.split(" ")[1];

    if (!token) {
        return errorHandler("Unauthorized", 401, auth_token);
    }

    return jwt.verify(token, process.env.PRIVATE_ACCESS_TOKEN, (error, decoded) => {
        if (error) {
            return errorHandler("Invalid token", 401, auth_token);
        }

        const userPayload = {
            id: decoded.id,
            email: decoded.email,
            country: decoded.country,
        };

        req.userData = userPayload;
        next();
    });
});

export default authToken;
