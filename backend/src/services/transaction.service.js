import Transaction from "../models/TransactionModel.js";

export const createData = async (data) => {
    return await Transaction.create(data)
}

export const depositHandler = async (owner, updateData) => {
    return await Transaction.findOneAndUpdate(
        { owner }, 
        updateData,
        { upsert: true, new: true}
    );
};

export const withdrawalHandler = async (owner, updateData) => {
    return await Transaction.findOneAndUpdate(
        { owner },
        updateData,
        { new: true}
    );
};

export const inquiryBalanceHandler = async (userEmail) => {
    return await Transaction.findOne({ owner: userEmail });
};

export const currentBalance = async (userEmail) => {
    return await Transaction.findOne({ owner: userEmail });
};