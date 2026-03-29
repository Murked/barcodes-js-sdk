import { ApiClient } from "../core/client";
import { TokenUsageResponse } from "../types";

export function createTokenEndpoints(client: ApiClient) {
    return {
        usage() {
            return client.get<TokenUsageResponse>("/token/usage");
        },
    };
}
