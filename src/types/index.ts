export type ApiMessage = string | Record<string, string[]>;

export interface V2Meta {
    response_time: string;
    request_fulfilled: boolean;
    request_debited: boolean;
}

export interface V2EnvelopeBase extends V2Meta {
    error: boolean;
}

export interface V2SuccessEnvelope extends V2EnvelopeBase {
    error: false;
}

export interface V2ErrorEnvelope extends V2EnvelopeBase {
    error: true;
    message: ApiMessage;
}

export interface ProductRecord {
    product_name: string | null;
    product_brand: string | null;
    product_category: string | null;
    product_unique_id: string | null;
    product_style_code: string | null;
    product_release_date: string | null;
    product_description: string | null;
    product_colorway: string | null;
    product_retail_price: string | number | null;
    product_image?: string | null;
    product_data?: unknown;
    _id?: string;
    match_count?: number;
    product_last_checked?: string | null;
    product_added?: string | null;
    product_updated?: string | null;
}

export interface ProductsPagination {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

export interface CursorPagination {
    current_page: string;
    next_page: string | null;
    has_next_page: boolean;
}

export interface ProductSearchResponse extends V2SuccessEnvelope {
    results: ProductRecord[];
    pagination: ProductsPagination;
}

export interface ProductBulkSearchResponse extends V2SuccessEnvelope {
    results: ProductRecord[];
}

export interface ProductLookupBySkuResponse extends V2SuccessEnvelope {
    results: ProductRecord[];
}

export interface ProductLookupByUidResponse extends V2SuccessEnvelope {
    results: ProductRecord[];
}

export interface ProductDetailsSize {
    eu: string;
    uk: string;
    us: string;
    ean: string | null;
    upc: string | null;
}

export interface ProductDetails {
    sku: string;
    type: string;
    colourway: string;
    category: string;
    title: string;
    brand: string;
    nickname: string;
    designer: string;
    main_color: string;
    model: string;
    product_unique_id: string | null;
    gender: string;
    upper_material: string;
    release_date: string;
    release_date_formatted: string;
    retail_price: string | number | null;
    retail_price_gbp: string | number | null;
    retail_price_usd: string | number | null;
    description: string;
    stockx_total_sold: string | number | null;
    image: string;
    sizes: ProductDetailsSize[];
    variants: number;
    variant_format: string;
    size_run: string;
    internal_category: string;
    search_sku: string;
}

export interface ProductDetailsResponse extends V2SuccessEnvelope {
    product: ProductDetails;
}

export interface ProductUpcomingResponse extends V2SuccessEnvelope {
    results: ProductRecord[];
    pagination: CursorPagination;
}

export interface ProductLatestResponse extends V2SuccessEnvelope {
    products: ProductRecord[];
    pagination: CursorPagination;
}

export interface ProductAlternativeEntity {
    slug: string;
    sku: string;
}

export interface ProductAlternativesResponse extends V2SuccessEnvelope {
    stockx?: ProductAlternativeEntity;
    goat?: ProductAlternativeEntity;
    alternatives?: unknown[];
}

export interface BarcodeProductSize {
    us: string | number | null;
    uk: string | number | null;
    eu: string | number | null;
}

export interface BarcodeLookupProduct {
    product_name: string | null;
    product_brand: string | null;
    product_category: string | null;
    product_unique_id: string | null;
    product_description: string | null;
    product_style_code: string | null;
    product_colorway: string | null;
    product_release_date: string | null;
    product_retail_price: string | number | null;
    product_image: string | null;
    product_sizes: string[];
    product_added: string | null;
    product_updated: string | null;
    product_data?: unknown;
    us_sizes?: string[];
}

export interface BarcodeLookupBarcode {
    barcode_type: string;
    barcode_value: string;
    barcode_added: string | null;
    product_size: BarcodeProductSize;
}

export type BarcodeLookupResponse =
    | (V2SuccessEnvelope & {
          product: BarcodeLookupProduct;
          barcode: BarcodeLookupBarcode;
      })
    | (V2SuccessEnvelope & {
          [key: string]: unknown;
      });

export interface BarcodeBySkuRecord {
    product_barcode_type: string;
    product_barcode_value: string;
    product_size: BarcodeProductSize;
    isVerified: boolean;
}

export interface BarcodeLookupBySkuResponse extends V2SuccessEnvelope {
    barcodes: BarcodeBySkuRecord[];
    pagination: CursorPagination;
}

export interface TokenUsageCalls {
    remaining: number;
    lifetime: number;
    plan_limit: number;
    used_this_cycle: number;
}

export interface TokenUsagePlan {
    type: string;
    name: string;
    expires_at: string;
    rate_limit: number;
    token_limit: number;
}

export interface TokenUsageToken {
    name: string;
    last_used_at: string;
}

export interface TokenUsageActivity {
    last_api_call_at: string;
    last_api_call_name: string;
    last_api_call_status: number;
}

export interface TokenUsageEstimates {
    average_daily_usage: number;
    estimated_days_left: number;
    basis: string;
}

export interface TokenUsage {
    calls: TokenUsageCalls;
    plan: TokenUsagePlan;
    token: TokenUsageToken;
    activity: TokenUsageActivity;
    estimates: TokenUsageEstimates;
}

export interface TokenUsageResponse extends V2SuccessEnvelope {
    usage: TokenUsage;
}

export interface ProductSearchParams {
    query: string;
    results?: number;
    page?: number;
}

export interface ProductBulkSearchBody {
    styleCodes: string[];
}

export interface ProductUpcomingQuery {
    results?: number;
    page?: number;
}

export interface ProductLatestQuery {
    page?: number;
    sort?: "asc" | "desc";
    release_date_search?: boolean;
    release_date?: string;
}

export type BarcodeLookupFields = "*" | string[];

export interface BarcodeLookupQuery {
    fields: BarcodeLookupFields;
}

export interface BarcodeLookupBySkuQuery {
    sizerun?: boolean;
    is_verified?: boolean;
}