import asyncHandler from "express-async-handler";

import * as transactionService from "../../services/transaction.service.js";
import errorHandler from "../../utils/errorHandler.js";
import transactionSchema from "../../schemas/transaction.schema.js";
import { FILE_NAME } from "../../constants/FILE_NAME.js";
import currencyCalculationHandler from "../../helpers/currencyCalculation.js";

const {
	middlewares: { VALIDATE_TRANSACTION },
} = FILE_NAME;

export const validateDepositMoney = asyncHandler(async (req, res, next) => {
	const result = await transactionSchema.safeParseAsync(req.body);
	const userId = req.userData?.id;

	if (!result.success) {
		return errorHandler("All fields are required.", 400, VALIDATE_TRANSACTION);
	}

	const { type, amount } = result.data;

	const user = await transactionService.userAccount(userId);

	if (!user) {
		return errorHandler("User not found", 404, VALIDATE_TRANSACTION);
	}

	const currentBalance = user.current_balance || 0;
	const newBalance = currentBalance + amount;

	const data = {
		userId,
		user,
		type,
		amount,
		currentBalance,
		newBalance,
	};

	req.data = data;
	next();
});

export const validateWithdrawMoney = asyncHandler(async (req, res, next) => {
	const result = await transactionSchema.safeParseAsync(req.body);
	const userId = req.userData?.id;
	let currentBalance = 0;

	if (!result.success) {
		return errorHandler("All fields are required", 400, VALIDATE_TRANSACTION);
	}

	const { type, amount } = result.data;

	const user = await transactionService.userAccount(userId);

	if (!user) {
		return errorHandler("User not found", 404, VALIDATE_TRANSACTION);
	}

	const user_balance = user.current_balance || 0;

	if (amount > user_balance) {
		return errorHandler("Insufficient balance.", 409, VALIDATE_TRANSACTION);
	} else {
		currentBalance = user_balance - amount;
	}

	const data = {
		userId,
		user,
		type,
		amount,
		currentBalance,
	};

	req.data = data;
	next();
});

export const validateTransferMoney = asyncHandler(async (req, res, next) => {
	const result = await transactionSchema.safeParseAsync(req.body);
	const userId = req.userData?.id;
	let currentBalance = 0;

	if (!result.success) {
		return errorHandler("All fields are required.", 400, VALIDATE_TRANSACTION);
	}

	const { type, amount, currency, transferTo } = result.data;

	const user = await transactionService.userAccount(userId);
	const receiver = await transactionService.receiverAccount(transferTo);

	if (!user || !receiver) {
		return errorHandler("User not found.", 404, VALIDATE_TRANSACTION);
	}

	const currencyCalculatedData = currencyCalculationHandler(amount, currency);

	if (user.owner === transferTo) {
		return errorHandler("You cannot transfer by your own account.", 409, VALIDATE_TRANSACTION);
	}

	const user_balance = user.current_balance || 0;
	const receiverCurrentBalance = receiver.current_balance || 0;

	if (amount > user_balance) {
		return errorHandler("Insufficient balance.", 409, VALIDATE_TRANSACTION);
	} else {
		currentBalance = user_balance - currencyCalculatedData.decreasedBalance;
	}

	const data = {
		userId,
		user,
		receiver,
		type,
		amount,
		transferTo,
		currentBalance,
		receiverCurrentBalance,
		currencyCalculatedData,
	};

	req.data = data;
	next();
});
