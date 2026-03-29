import { ApiClient, ClientOptions } from "./core/client";
import { createBarcodeEndpoints } from "./endpoints/barcodes";
import { createProductsEndpoints } from "./endpoints/products";
import { createTokenEndpoints } from "./endpoints/tokens";

export function createSdk(options: ClientOptions) {
    const client = new ApiClient(options);

    return {
        products: createProductsEndpoints(client),
        barcodes: createBarcodeEndpoints(client),
        tokens: createTokenEndpoints(client),
    };
}