import { ApiError } from "./apiError";

export class BadRequestError extends ApiError {
    constructor(message = "Bad request") {
        super(message, 400);
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

export class NotFoundError extends ApiError {
    constructor(message = "Not found") {
        super(message, 404);
    }
}

export class ConflictError extends ApiError {
    constructor(message = "Conflict") {
        super(message, 409);
    }
}

export class TooManyRequestsError extends ApiError {
    constructor(message = "Too many requests") {
        super(message, 429);
    }
}