export type Fetcher = typeof fetch;

export interface FetcherOptions {
    fetch?: Fetcher;
}

export function getFetch(customFetch?: Fetcher): Fetcher {
    if (customFetch) return customFetch;

    if (typeof fetch !== "undefined") {
        return fetch;
    }

    throw new Error(
        "No fetch implementation found. Pass one in options."
    );
}