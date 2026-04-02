# @barcodesgg/sdk

Official TypeScript SDK for the Barcodes.gg V2 API.

## Installation

```bash
npm install @barcodesgg/sdk
```

## Quick start

```ts
import { createSdk } from "@barcodesgg/sdk";

const sdk = createSdk({
  apiKey: "YOUR_API_TOKEN",
});

const result = await sdk.products.search({
  query: "travis",
  results: 10,
  page: 1,
});

console.log(result.results);
```

The SDK targets:

- `https://barcodes.gg/api/v2/` (default)

`apiKey` is required.

You can optionally override just the prefix:

```ts
const sdk = createSdk({
  apiKey: "YOUR_API_TOKEN",
  apiPrefix: "/v2",
});
```

Client usage:

- `sdk.products.search(...)`
- `sdk.barcodes.lookup(...)`
- `sdk.tokens.usage()`

## Endpoints

### Products

#### Search products

```ts
const response = await sdk.products.search({
  query: "jordan",
  results: 20,
  page: 1,
});
```

#### Bulk search by style code

```ts
const response = await sdk.products.searchBulk(
  { styleCodes: ["DZ5485-612", "HQ1772-100"] }
);
```

#### Lookup product by SKU

```ts
const response = await sdk.products.lookupBySku("DZ5485-612");
```

#### Lookup product by unique ID

```ts
const response = await sdk.products.lookupByUid("prod_123456");
```

#### Product details

```ts
const response = await sdk.products.details("DZ5485-612");
```

#### Upcoming products

```ts
const response = await sdk.products.upcoming({
  results: 25,
  page: 1,
});
```

#### Latest products

```ts
const response = await sdk.products.latest({
  page: 1,
  sort: "desc",
  release_date_search: true,
  release_date: "2026-03-29",
});
```

#### Product alternatives

```ts
const response = await sdk.products.alternatives("DZ5485-612");
```

### Images

The image endpoints live under /api (not /api/v2) and return raw image bytes.

- GET /api/image/{style_code}
- GET /api/image/uid/{product_unique_id}

Example fetch call:

```ts
const res = await fetch("https://barcodes.gg/api/image/uid/prod_123456", {
  headers: {
    Authorization: `Bearer ${process.env.BARCODES_API_KEY}`,
  },
});

if (!res.ok) {
  throw new Error(`Image lookup failed with status ${res.status}`);
}

const imageBytes = await res.arrayBuffer();
```

## Why UID Methods Exist

Some products can share the same SKU while still having meaningful differences (for example, color variants). In those cases, SKU-based lookups may not be specific enough.

Use product_unique_id from search responses when you need exact product targeting:

- Product lookup by UID: sdk.products.lookupByUid(productUniqueId)

This gives you a stable way to fetch the exact product payload and image for one specific variant.

### Barcodes

#### Lookup by barcode

```ts
const response = await sdk.barcodes.lookup("1234567890123", {
  fields: "*",
});
```

#### Lookup by barcode with custom fields

```ts
const response = await sdk.barcodes.lookup("1234567890123", {
  fields: ["product_name", "product_style_code", "barcode_value"],
});
```

#### Lookup barcodes by SKU

```ts
const response = await sdk.barcodes.lookupBySku("DZ5485-612", {
  sizerun: false,
  is_verified: true,
});
```

### Tokens

#### Token usage

```ts
const response = await sdk.tokens.usage();
console.log(response.usage.calls.remaining);
```

## Full script example

```ts
import { createSdk } from "@barcodesgg/sdk";

async function main() {
  const sdk = createSdk({
    apiKey: process.env.BARCODES_API_KEY || "YOUR_API_TOKEN",
  });

  const search = await sdk.products.search({
    query: "jordan",
    results: 10,
    page: 1,
  });
  console.log("search results:", search.results.length);

  const styleCode = search.results[0]?.product_style_code;
  if (!styleCode) {
    console.log("no style code found from search");
    return;
  }

  const details = await sdk.products.details(styleCode);
  console.log("product title:", details.product.title);

  const skuBarcodes = await sdk.barcodes.lookupBySku(styleCode, {
    is_verified: true,
  });
  console.log("barcode count:", skuBarcodes.barcodes.length);

  const usage = await sdk.tokens.usage();
  console.log("remaining calls:", usage.usage.calls.remaining);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

## Types

```ts
import type {
  ProductSearchResponse,
  ProductDetailsResponse,
  BarcodeLookupResponse,
  TokenUsageResponse,
} from "@barcodesgg/sdk";
```
