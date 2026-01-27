import express from "express";

import * as transactionController from "../controllers/transaction.controller.js";
import { validateDepositMoney, validateWithdrawMoney, validateTransferMoney } from "../middlewares/validation/validateTransaction.js";
import authToken from "../middlewares/authToken.js";

const route = express.Router();

route.patch("/deposit", authToken, validateDepositMoney, transactionController.depositMoney);
route.patch("/withdraw", authToken, validateWithdrawMoney, transactionController.withdrawMoney);
route.post("/transfer", authToken, validateTransferMoney, transactionController.transferMoney);

export default route;
