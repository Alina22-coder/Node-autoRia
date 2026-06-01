export class ApiError extends Error {
    constructor(
        public message: string,
        public status: number,
    ) {
        super(message);
        this.name = "ApiError";
    }

    static badRequest(message: string): ApiError {
        return new ApiError(message, 400);
    }

    static unauthorized(message: string = "Unauthorized"): ApiError {
        return new ApiError(message, 401);
    }

    static forbidden(message: string = "Forbidden"): ApiError {
        return new ApiError(message, 403);
    }

    static notFound(message: string = "Not found"): ApiError {
        return new ApiError(message, 404);
    }

    static conflict(message: string): ApiError {
        return new ApiError(message, 409);
    }
}
