export class ApiError extends Error {
    statusCode: number;
    errorMessage: string;

    constructor(message: string = "An unexpected error occurred", statusCode: number = 500) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errorMessage = message;

        // Ensures correct prototype chain when transpiled to ES5
        Object.setPrototypeOf(this, new.target.prototype);
    }
}