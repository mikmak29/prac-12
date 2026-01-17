import express from "express";
import cookie from 'cookie-parser';
import asyncHandler from "express-async-handler";
import throwHTTPError from "./utils/throwHTTPError.js";
import ResponseHandler from "./utils/ResponseHandler.js";
import errorHandler from "./middleware/errorHandler.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import NotFoundHandler from "./errors/NotFoundHandler.js";

const app = express();
const port = 8000 || 8100;

app.use(express.json());
app.use(cookie());

app.get("/api/user", asyncHandler(async (req, res) => {
	const user = req.cookies?.userDatas;

	console.log(user);
	if (!user) {
		return errorHandler('No data found.', 404, "server.js");
	}

	ResponseHandler(res, true, 200, user);
}));

app.post("/api/user", asyncHandler(async (req, res) => {
	const { name, role } = req.body;

	if (!name || !role) {
		return errorHandler("All fields are required.", 404, "POST Method at server.js");
	}
	const userData = {
		name: name,
		role: role
	};

	res.cookie("userData", userData, {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		path: '/api'
	});

	ResponseHandler(res, true, 201, userData);
}));

app.use(NotFoundHandler);

app.use(globalErrorHandler);

app.listen(port, () => {
	console.log(`Server is running at PORT ${port}`);
});
