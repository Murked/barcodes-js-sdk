import { ApiClient } from "../core/client";
import {
    ProductAlternativesResponse,
    ProductBulkSearchBody,
    ProductBulkSearchResponse,
    ProductDetailsResponse,
    ProductLatestQuery,
    ProductLatestResponse,
    ProductLookupBySkuResponse,
    ProductSearchParams,
    ProductSearchResponse,
    ProductUpcomingQuery,
    ProductUpcomingResponse,
} from "../types";

export function createProductsEndpoints(client: ApiClient) {
    return {
        search(params: ProductSearchParams) {
            return client.get<ProductSearchResponse>("/product/search", params);
        },

        searchBulk(body: ProductBulkSearchBody) {
            return client.post<ProductBulkSearchResponse>("/product/search/bulk", body);
        },

        lookupBySku(styleCode: string) {
            const encodedStyleCode = encodeURIComponent(styleCode);
            return client.get<ProductLookupBySkuResponse>(`/product/lookup/sku/${encodedStyleCode}`);
        },

        details(styleCode: string) {
            const encodedStyleCode = encodeURIComponent(styleCode);
            return client.get<ProductDetailsResponse>(`/product/details/${encodedStyleCode}`);
        },

        upcoming(query?: ProductUpcomingQuery) {
            return client.get<ProductUpcomingResponse>("/product/upcoming", query);
        },

        latest(query?: ProductLatestQuery) {
            return client.get<ProductLatestResponse>("/product/latest", query);
        },

        alternatives(styleCode: string) {
            const encodedStyleCode = encodeURIComponent(styleCode);
            return client.get<ProductAlternativesResponse>(`/product/alternatives/${encodedStyleCode}`);
        },
    };
}
