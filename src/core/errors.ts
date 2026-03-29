export class ApiError extends Error {
    status?: number;
    data?: unknown;

    constructor(message: string, status?: number, data?: unknown) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

export class ApiHttpError extends ApiError {
    constructor(status: number, data?: unknown, message = "Request failed") {
        super(message, status, data);
        this.name = "ApiHttpError";
    }
}

export class ApiResponseError extends ApiError {
    apiMessage: string | Record<string, string[]> | unknown;

    constructor(
        apiMessage: string | Record<string, string[]> | unknown,
        status?: number,
        data?: unknown
    ) {
        super(typeof apiMessage === "string" ? apiMessage : "API returned an error", status, data);
        this.name = "ApiResponseError";
        this.apiMessage = apiMessage;
    }
}