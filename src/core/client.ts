import { ApiHttpError, ApiResponseError } from "./errors";
import { getFetch, Fetcher } from "./fetcher";

const API_BASE_URL = "https://barcodes.gg/api";

export interface ClientOptions {
    apiKey: string;
    fetch?: Fetcher;
    apiPrefix?: string;
    throwOnApiError?: boolean;
}

export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = object;

interface ApiErrorEnvelope {
    error?: boolean;
    message?: string | Record<string, string[]>;
}

export class ApiClient {
    private baseUrl: string;
    private apiKey: string;
    private fetch: Fetcher;
    private throwOnApiError: boolean;

    constructor(options: ClientOptions) {
        if (!options.apiKey?.trim()) {
            throw new Error("apiKey is required");
        }

        this.baseUrl = buildBaseUrl(API_BASE_URL, options.apiPrefix ?? "/v2");
        this.apiKey = options.apiKey;
        this.fetch = getFetch(options.fetch);
        this.throwOnApiError = options.throwOnApiError ?? true;
    }

    async request<T>(
        path: string,
        init?: RequestInit,
        query?: QueryParams
    ): Promise<T> {
        const url = buildUrl(this.baseUrl, path, query);

        const res = await this.fetch(url, {
            ...init,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`,
                ...init?.headers,
            },
        });

        let data: unknown;
        const contentType = res.headers.get("content-type") ?? "";

        try {
            if (contentType.includes("application/json")) {
                data = await res.json();
            } else {
                data = await res.text();
            }
        } catch {
            data = null;
        }

        if (!res.ok) {
            throw new ApiHttpError(res.status, data);
        }

        if (this.throwOnApiError && isApiEnvelopeWithError(data)) {
            throw new ApiResponseError(data.message ?? "API returned an error", res.status, data);
        }

        return data as T;
    }

    get<T>(path: string, query?: QueryParams) {
        return this.request<T>(path, undefined, query);
    }

    post<T>(path: string, body?: unknown, query?: QueryParams) {
        return this.request<T>(path, {
            method: "POST",
            body: JSON.stringify(body),
        }, query);
    }
}

function buildBaseUrl(baseUrl: string, apiPrefix: string): string {
    const normalizedBase = baseUrl.replace(/\/+$/, "");
    const normalizedPrefix = normalizePath(apiPrefix);

    return `${normalizedBase}${normalizedPrefix}`;
}

function buildUrl(baseUrl: string, path: string, query?: QueryParams): string {
    const normalizedPath = normalizePath(path);
    const url = `${baseUrl}${normalizedPath}`;

    if (!query) {
        return url;
    }

    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(query as Record<string, unknown>)) {
        if (value === undefined || value === null) {
            continue;
        }

        if (Array.isArray(value)) {
            for (const item of value) {
                if (item === undefined || item === null || !isQueryValue(item)) {
                    continue;
                }

                searchParams.append(key, String(item));
            }

            continue;
        }

        if (!isQueryValue(value)) {
            continue;
        }

        searchParams.append(key, String(value));
    }

    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
}

function normalizePath(path: string): string {
    if (!path) {
        return "";
    }

    return path.startsWith("/") ? path : `/${path}`;
}

function isApiEnvelopeWithError(data: unknown): data is ApiErrorEnvelope & { error: true } {
    if (!data || typeof data !== "object") {
        return false;
    }

    if (!("error" in data)) {
        return false;
    }

    return (data as ApiErrorEnvelope).error === true;
}

function isQueryValue(value: unknown): value is Exclude<QueryValue, undefined | null> {
    return (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
    );
}