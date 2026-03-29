import { ApiClient } from "../core/client";
import {
    BarcodeLookupBySkuQuery,
    BarcodeLookupBySkuResponse,
    BarcodeLookupQuery,
    BarcodeLookupResponse,
} from "../types";

export function createBarcodeEndpoints(client: ApiClient) {
    return {
        lookup(barcode: string, query: BarcodeLookupQuery) {
            const encodedBarcode = encodeURIComponent(barcode);
            const fields =
                query.fields === "*"
                    ? "*"
                    : query.fields.map((value) => value.trim()).filter(Boolean).join(",");

            return client.get<BarcodeLookupResponse>(`/barcode/lookup/${encodedBarcode}`, {
                fields,
            });
        },

        lookupBySku(styleCode: string, query?: BarcodeLookupBySkuQuery) {
            const encodedStyleCode = encodeURIComponent(styleCode);
            return client.get<BarcodeLookupBySkuResponse>(`/barcode/lookup/sku/${encodedStyleCode}`, query);
        },
    };
}
