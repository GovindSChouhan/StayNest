// ExpressError is a Custom Error Class.
// It extends JavaScript's built-in Error class.
// Purpose:
// → Store both statusCode and error message
// in one object.
//
// Example:
// throw new ExpressError(404, "Page Not Found");
//
// Error Object:
// {
//    statusCode: 404,
//     message: "Page Not Found"
// }


class ExpressError extends Error {
    constructor(statusCode, message) {
        super(message);

        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;