import mongoose from "mongoose";

const validateObjectId = (objectId) => {
    if (!mongoose.Types.ObjectId.isValid(objectId)) {
        const error = new Error("Invalid ID.");
        error.statusCode = 404;
        error.filePath = "validateObjectId.js";
        throw error;
    }
};

export default validateObjectId;
