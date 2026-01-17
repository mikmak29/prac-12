const errorHandler = (errorMessage, statusCode, path) => {
    const error = new Error(errorMessage);
    error.statusCode = statusCode;
    error.path = path;
    throw error;
};

export default errorHandler;
