/**
 * API Service functions for backend integration
 */
import axios from "axios";
import { getApiUrl, getApiHeaders, API_CONFIG } from "./api-config";
import { Review } from "@/types/review";
import { ReturnPolicy } from "@/types/return-policy";
import { SystemUser } from "@/types/system-user";
import { Category } from "@/types/category";
import { PolicyPage } from "@/types/policy";

// Types
export interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    discountPrice?: number;
    description?: string;
    images?: { url: string; alt?: string; isPrimary?: boolean }[];
    thumbnail?: string;
    isActive: boolean;
    isFlashSell: boolean;
    flashSellStartTime?: Date;
    flashSellEndTime?: Date;
    flashSellPrice?: number;
    category: Category;
    createdAt: Date;
    updatedAt: Date;
}

export interface Banner {
    id: number;
    title: string;
    subtitle: string;
    imageUrl: string;
    buttonText?: string;
    buttonLink?: string;
    isActive: boolean;
    order: number;
    companyId: string;
    createdAt: string;
    updatedAt: string;
}

export interface TopProductsItem {
    id: number;
    title: string;
    desc: string;
    image: string;
    isActive: boolean;
    order: number;
}

export interface TopProductsSection {
    leftImage: string | null;
    rightImage: string | null;
    carouselItems: TopProductsItem[];
}

export interface ApiResponse<T> {
    statusCode: number;
    message?: string;
    data: T;
}

export interface CartItem {
    id: number;
    product: Product;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    companyId?: string;
}

export interface CartData {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
}

export interface PromoCode {
    id: number;
    code: string;
    description?: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    minOrderAmount?: number;
    startsAt?: string;
    expiresAt?: string;
    isActive: boolean;
    companyId: string;
    // Optional list of product IDs this promo applies to
    productIds?: Array<number | string>;
}

/**
 * Get terms & conditions (public endpoint for storefront)
 */
export async function getTerms(companyId?: string): Promise<PolicyPage[]> {
    try {
        const companyIdParam = companyId || API_CONFIG.companyId;
        const params = new URLSearchParams();
        if (companyIdParam) params.append("companyId", companyIdParam);

        const response = await axios.get<ApiResponse<PolicyPage[]> | PolicyPage[]>(
            getApiUrl(`/trems-condetions/public?${params.toString()}`),
        );

        const payload: ApiResponse<PolicyPage[]> | PolicyPage[] = response.data;
        const data = Array.isArray(payload)
            ? payload
            : (payload && typeof payload === "object" && "data" in payload && Array.isArray(payload.data))
            ? payload.data
            : [];
        return Array.isArray(data) ? data : [];
    } catch (error: unknown) {
        console.error("Error fetching terms:", error);
        return [];
    }
}

/**
 * Get privacy policy (public endpoint for storefront)
 */
export async function getPrivacyPolicies(companyId?: string): Promise<PolicyPage[]> {
    try {
        const companyIdParam = companyId || API_CONFIG.companyId;
        const params = new URLSearchParams();
        if (companyIdParam) params.append("companyId", companyIdParam);

        const response = await axios.get<ApiResponse<PolicyPage[]> | PolicyPage[]>(
            getApiUrl(`/privecy-policy/public?${params.toString()}`),
        );

        const payload: ApiResponse<PolicyPage[]> | PolicyPage[] = response.data;
        const data = Array.isArray(payload)
            ? payload
            : (payload && typeof payload === "object" && "data" in payload && Array.isArray(payload.data))
            ? payload.data
            : [];
        return Array.isArray(data) ? data : [];
    } catch (error: unknown) {
        console.error("Error fetching privacy policy:", error);
        return [];
    }
}

/**
 * Get system user info by companyId
 */
export async function getSystemUserByCompanyId(
    companyId?: string,
): Promise<SystemUser | null> {
    try {
        const companyIdParam = companyId || API_CONFIG.companyId;
        const params = new URLSearchParams();
        if (companyIdParam) params.append("companyId", companyIdParam);

        const response = await axios.get<ApiResponse<SystemUser[]> | SystemUser>(
            getApiUrl(`/systemuser?${params.toString()}`),
        );

        const payload: ApiResponse<SystemUser[]> | SystemUser = response.data;
        const data = Array.isArray(payload)
            ? payload
            : (payload && typeof payload === "object" && "data" in payload)
            ? payload.data
            : payload;
        const users: SystemUser[] = Array.isArray(data) ? data : data ? [data as SystemUser] : [];

        const matchedOwner = users.find(
            (user) => user.companyId === companyIdParam && user.role === "SYSTEM_OWNER",
        );
        const matchedAny = users.find((user) => user.companyId === companyIdParam);

        return matchedOwner ?? matchedAny ?? users[0] ?? null;
    } catch (error: unknown) {
        console.error("Error fetching system user:", error);
        const err = error as { code?: string; message?: string; cause?: { code?: string } };
        if (
            err.code === 'ECONNREFUSED' ||
            err.code === 'ETIMEDOUT' ||
            err.code === 'ENOTFOUND' ||
            err.message?.includes('ECONNREFUSED') ||
            err.message?.includes('ETIMEDOUT') ||
            err.message?.includes('ENOTFOUND') ||
            err.message?.includes('Network Error') ||
            err.message?.includes('fetch failed') ||
            (err.cause && err.cause.code === 'ECONNREFUSED')
        ) {
            console.warn("Backend server is not running or not accessible. Please start the backend server.");
            return null;
        }
        return null;
    }
}

/**
 * Create a new system user (e.g. reseller/company)
 */
export async function createSystemUser(
    payload: {
        name: string;
        email: string;
        companyName: string;
        companyId: string;
        companyLogo?: string | null;
        phone?: string | null;
        branchLocation?: string | null;
    },
    token?: string,
): Promise<SystemUser> {
    const response = await axios.post<ApiResponse<SystemUser> | SystemUser>(
        getApiUrl("/systemuser"),
        payload,
        token ? { headers: getApiHeaders(token) } : undefined,
    );

    const data = response.data;
    if (data && typeof data === "object" && "data" in data) {
        return (data as ApiResponse<SystemUser>).data;
    }
    return data as SystemUser;
}

/**
 * Get all products
 */
export async function getProducts(
    companyId?: string,
): Promise<Product[]> {
    try {
        const params = new URLSearchParams();
        const companyIdParam = companyId || API_CONFIG.companyId;
        if (companyIdParam) params.append("companyId", companyIdParam);

        const response = await axios.get<ApiResponse<Product[]>>(
            getApiUrl(`/products/all?companyId=${companyIdParam}`),
        );
        return response.data.data;
    } catch (error: unknown) {
        console.error("Error fetching products:", error);
        const err = error as {
            code?: string;
            message?: string;
            cause?: { code?: string } | AggregateError;
            name?: string;
            errors?: unknown[];
        };
        // Handle various connection errors including AggregateError
        const isConnectionError =
            err.code === 'ECONNREFUSED' ||
            err.code === 'ETIMEDOUT' ||
            err.code === 'ENOTFOUND' ||
            err.message?.includes('ECONNREFUSED') ||
            err.message?.includes('ETIMEDOUT') ||
            err.message?.includes('ENOTFOUND') ||
            err.message?.includes('Network Error') ||
            err.message?.includes('fetch failed') ||
            err.message?.includes('AggregateError') ||
            (err.cause && (err.cause as { code?: string }).code === 'ECONNREFUSED') ||
            err.name === 'AggregateError' ||
            (err.name === 'AggregateError' && err.errors && Array.isArray(err.errors));

        if (isConnectionError) {
            console.warn("Backend server is not running or not accessible. Please start the backend server.");
            return [];
        }
        // For other errors, still return empty array to prevent app crash
        return [];
    }
}

/**
 * Get reviews for a product
 */
export async function getProductReviews(
    productId: number,
    companyId?: string,
): Promise<Review[]> {
    try {
        const params = new URLSearchParams();
        const companyIdParam = companyId || API_CONFIG.companyId;
        if (companyIdParam) params.append("companyId", companyIdParam);

        const response = await axios.get<ApiResponse<Review[]> | Review[]>(
            getApiUrl(`/reviews/product/${productId}?${params.toString()}`),
        );

        const payload: ApiResponse<Review[]> | Review[] = response.data;
        const data = Array.isArray(payload) ? payload : (payload && typeof payload === 'object' && 'data' in payload) ? payload.data : [];
        return Array.isArray(data) ? data : [];
    } catch (error: unknown) {
        console.error("Error fetching product reviews:", error);
        return [];
    }
}

/**
 * Get refund/return policies
 */
export async function getRefundPolicies(
    companyId?: string,
): Promise<ReturnPolicy[]> {
    try {
        const params = new URLSearchParams();
        const companyIdParam = companyId || API_CONFIG.companyId;
        if (companyIdParam) params.append("companyId", companyIdParam);

        const response = await axios.get<ApiResponse<ReturnPolicy[]> | ReturnPolicy[]>(
            getApiUrl(`/refund-policy/public?${params.toString()}`),
        );

        const payload: ApiResponse<ReturnPolicy[]> | ReturnPolicy[] = response.data;
        const data = Array.isArray(payload) ? payload : (payload && typeof payload === 'object' && 'data' in payload) ? payload.data : [];
        return Array.isArray(data) ? data : [];
    } catch (error: unknown) {
        console.error("Error fetching refund policies:", error);
        return [];
    }
}

/**
 * Get products by category
 */
export async function getProductsByCategory(
    companyId?: string,
    categoryName?: string,
    categoryId?: number
): Promise<Product[]> {
    try {
        const params = new URLSearchParams();
        const companyIdParam = companyId || API_CONFIG.companyId;
        if (companyIdParam) params.append("companyId", companyIdParam);
        if (categoryName) params.append("categories", categoryName);
        if (categoryId) params.append("categoryId", categoryId.toString());

        const response = await axios.get<ApiResponse<Product[]> | Product[]>(
            // Use public endpoint to avoid auth/guards (theme/storefront)
            getApiUrl(`/products/public/category?${params.toString()}`),
        );
        const payload: ApiResponse<Product[]> | Product[] = response.data;
        if (Array.isArray(payload)) return payload as unknown as Product[];
        if (payload && typeof payload === "object" && "data" in payload && Array.isArray(payload.data)) return payload.data as Product[];
        return [];
    } catch (error: unknown) {
        console.error("Error fetching products by category:", error);
        const err = error as {
            code?: string;
            message?: string;
            cause?: { code?: string } | AggregateError;
            name?: string;
            errors?: unknown[];
        };
        // Handle various connection errors including AggregateError
        const isConnectionError =
            err.code === 'ECONNREFUSED' ||
            err.code === 'ETIMEDOUT' ||
            err.code === 'ENOTFOUND' ||
            err.message?.includes('ECONNREFUSED') ||
            err.message?.includes('ETIMEDOUT') ||
            err.message?.includes('ENOTFOUND') ||
            err.message?.includes('Network Error') ||
            err.message?.includes('fetch failed') ||
            err.message?.includes('AggregateError') ||
            (err.cause && (err.cause as { code?: string }).code === 'ECONNREFUSED') ||
            err.name === 'AggregateError' ||
            (err.name === 'AggregateError' && err.errors && Array.isArray(err.errors));

        if (isConnectionError) {
            console.warn("Backend server is not running or not accessible. Please start the backend server.");
            return [];
        }
        // For other errors, still return empty array to prevent app crash
        return [];
    }
}

/**
 * Get a single product by ID (uses public endpoint so storefront works without auth)
 */
export async function getProduct(id: number, companyId?: string): Promise<Product> {
    try {
        const companyIdParam = companyId || API_CONFIG.companyId;
        const params = new URLSearchParams();
        if (companyIdParam) params.append("companyId", companyIdParam);
        const response = await axios.get<ApiResponse<Product>>(
            getApiUrl(`/products/public/${id}?${params.toString()}`),
        );
        return response.data.data;
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
}

/**
 * Get a single product by slug/SKU (public endpoint, identifier can be non-numeric)
 */
export async function getProductBySlug(slug: string, companyId?: string): Promise<Product> {
    try {
        const companyIdParam = companyId || API_CONFIG.companyId;
        const params = new URLSearchParams();
        if (companyIdParam) params.append("companyId", companyIdParam);
        const response = await axios.get<ApiResponse<Product>>(
            getApiUrl(`/products/public/${encodeURIComponent(slug)}?${params.toString()}`),
        );
        return response.data.data;
    } catch (error) {
        console.error("Error fetching product by slug:", error);
        throw error;
    }
}

/**
 * Get trending products (public). Uses fetch for Server Components; never throws.
 */
export async function getTrendingProducts(
    days?: number,
    limit?: number,
    companyId?: string
): Promise<Product[]> {
    try {
        const params = new URLSearchParams();
        params.set("companyId", companyId || API_CONFIG.companyId);
        if (days != null) params.set("days", String(days));
        if (limit != null) params.set("limit", String(limit));
        const url = getApiUrl(`/products/trending?${params.toString()}`);
        const res = await fetch(url, { next: { revalidate: 60 } });
        if (!res.ok) return [];
        const json = await res.json();
        const data = json?.data;
        return Array.isArray(data) ? data : [];
    } catch {
        console.warn("Trending products: backend not accessible, using empty list.");
        return [];
    }
}

/**
 * Get active flash sell products
 */
export async function getFlashSaleProducts(companyId?: string): Promise<Product[]> {
    try {
        const params = new URLSearchParams();
        const companyIdParam = companyId || API_CONFIG.companyId;
        if (companyIdParam) params.append("companyId", companyIdParam);

        const response = await axios.get<ApiResponse<Product[]>>(
            getApiUrl(`/products/flash-sell/active?${params.toString()}`),
        );
        return response.data.data;
    } catch (error: unknown) {
        console.error("Error fetching flash sale products:", error);
        const err = error as {
            code?: string;
            message?: string;
            cause?: { code?: string } | AggregateError;
            name?: string;
            errors?: unknown[];
        };
        // Handle various connection errors including AggregateError
        const isConnectionError =
            err.code === 'ECONNREFUSED' ||
            err.code === 'ETIMEDOUT' ||
            err.code === 'ENOTFOUND' ||
            err.message?.includes('ECONNREFUSED') ||
            err.message?.includes('ETIMEDOUT') ||
            err.message?.includes('ENOTFOUND') ||
            err.message?.includes('Network Error') ||
            err.message?.includes('fetch failed') ||
            err.message?.includes('AggregateError') ||
            (err.cause && (err.cause as { code?: string }).code === 'ECONNREFUSED') ||
            err.name === 'AggregateError' ||
            (err.name === 'AggregateError' && err.errors && Array.isArray(err.errors));

        if (isConnectionError) {
            console.warn("Backend server is not running or not accessible. Please start the backend server.");
            return [];
        }
        // For other errors, still return empty array to prevent app crash
        return [];
    }
}

/**
 * Get all categories
 */
export async function getCategories(companyId?: string): Promise<Category[]> {
    try {
        const params = new URLSearchParams();
        const companyIdParam = companyId || API_CONFIG.companyId;
        if (companyIdParam) params.append("companyId", companyIdParam);

        const response = await axios.get<ApiResponse<Category[]>>(
            getApiUrl(`/categories/public?${params.toString()}`),
        );
        const payload = response.data;
        if (Array.isArray(payload)) return payload;
        if (payload && typeof payload === "object" && "data" in payload && Array.isArray(payload.data)) return payload.data;
        return [];
    } catch (error: unknown) {
        console.error("Error fetching categories:", error);
        const err = error as {
            code?: string;
            message?: string;
            cause?: { code?: string } | AggregateError;
            name?: string;
            errors?: unknown[];
        };
        // Handle various connection errors including AggregateError
        const isConnectionError =
            err.code === 'ECONNREFUSED' ||
            err.code === 'ETIMEDOUT' ||
            err.code === 'ENOTFOUND' ||
            err.message?.includes('ECONNREFUSED') ||
            err.message?.includes('ETIMEDOUT') ||
            err.message?.includes('ENOTFOUND') ||
            err.message?.includes('Network Error') ||
            err.message?.includes('fetch failed') ||
            err.message?.includes('AggregateError') ||
            (err.cause && (err.cause as { code?: string }).code === 'ECONNREFUSED') ||
            err.name === 'AggregateError' ||
            (err.name === 'AggregateError' && err.errors && Array.isArray(err.errors));

        if (isConnectionError) {
            console.warn("Backend server is not running or not accessible. Please start the backend server.");
            return [];
        }
        // For other errors, still return empty array to prevent app crash
        return [];
    }
}

/**
 * Get a single category by ID
 */
export async function getCategory(
    id: number,
    companyId?: string
): Promise<Category> {
    try {
        const params = new URLSearchParams();
        const companyIdParam = companyId || API_CONFIG.companyId;
        if (companyIdParam) params.append("companyId", companyIdParam);
        const response = await axios.get<ApiResponse<Category>>(
            getApiUrl(`/categories/public/${id}?${params.toString()}`),

        );
        return response.data.data;
    } catch (error) {
        console.error("Error fetching category:", error);
        throw error;
    }
}

/**
 * Create a review for a product
 */
export async function createReview(
    payload: { productId: number; rating: number; title?: string; comment: string },
    token: string,
    companyId?: string
): Promise<Review> {
    const params = new URLSearchParams();
    const companyIdParam = companyId || API_CONFIG.companyId;
    if (companyIdParam) params.append("companyId", companyIdParam);

    const response = await axios.post<ApiResponse<Review> | Review>(
        getApiUrl(`/reviews?${params.toString()}`),
        payload,
        {
            headers: getApiHeaders(token),
        }
    );

    const payloadData: ApiResponse<Review> | Review = response.data;
    const data = (payloadData && typeof payloadData === 'object' && 'data' in payloadData) ? payloadData.data : payloadData;
    return data as Review;
}

/**
 * Cart APIs
 */
export async function getCart(
    userId: number,
    token: string,
    companyId?: string,
): Promise<CartData> {
    const companyIdParam = companyId || API_CONFIG.companyId;
    const response = await axios.get<ApiResponse<CartItem[]> | CartItem[]>(
        getApiUrl(`/cartproducts/user/${userId}?companyId=${companyIdParam}`),
        { headers: getApiHeaders(token) },
    );
    const payload: ApiResponse<CartItem[]> | CartItem[] = response.data;
    const data = Array.isArray(payload) ? payload : (payload && typeof payload === 'object' && 'data' in payload) ? payload.data : [];
    const items: CartItem[] = Array.isArray(data) ? data : [];
    const totalItems = items.reduce((sum, i) => sum + (i.quantity || 0), 0);
    const totalPrice = items.reduce((sum, i) => sum + Number(i.totalPrice || 0), 0);
    return { items, totalItems, totalPrice };
}

export async function addCartItemApi(
    userId: number,
    productId: number,
    quantity: number,

    companyId?: string,
): Promise<CartItem> {
    const companyIdParam = companyId || API_CONFIG.companyId;
    const response = await axios.post<ApiResponse<CartItem> | CartItem>(
        getApiUrl("/cartproducts"),
        { userId, productId, quantity, companyId: companyIdParam },

    );
    const payload: ApiResponse<CartItem> | CartItem = response.data;
    return (payload && typeof payload === 'object' && 'data' in payload) ? payload.data : payload as CartItem;
}

export async function updateCartItemApi(
    cartItemId: number,
    quantity: number,

    companyId?: string,
): Promise<CartItem> {
    const companyIdParam = companyId || API_CONFIG.companyId;
    const response = await axios.patch<ApiResponse<CartItem> | CartItem>(
        getApiUrl(`/cartproducts/${cartItemId}?companyId=${companyIdParam}`),
        { quantity },

    );
    const payload: ApiResponse<CartItem> | CartItem = response.data;
    return (payload && typeof payload === 'object' && 'data' in payload) ? payload.data : payload as CartItem;
}

export async function deleteCartItemApi(
    cartItemId: number,

    companyId?: string,
): Promise<void> {
    const companyIdParam = companyId || API_CONFIG.companyId;
    await axios.delete(
        getApiUrl(`/cartproducts/${cartItemId}?companyId=${companyIdParam}`),

    );
}

export async function clearCartApi(
    userId: number,
    token: string,
    companyId?: string,
): Promise<void> {
    const companyIdParam = companyId || API_CONFIG.companyId;
    await axios.delete(
        getApiUrl(`/cartproducts/user/${userId}?companyId=${companyIdParam}`),
        { headers: getApiHeaders(token) },
    );
}

/**
 * Promo codes
 */
export async function getPromocodes(token: string, companyId?: string): Promise<PromoCode[]> {
    const companyIdParam = companyId || API_CONFIG.companyId;
    const response = await axios.get<ApiResponse<PromoCode[]> | PromoCode[]>(
        getApiUrl(`/promocode?companyId=${companyIdParam}`),
        { headers: getApiHeaders(token) }
    );
    const payload: ApiResponse<PromoCode[]> | PromoCode[] = response.data;
    const data = Array.isArray(payload) ? payload : (payload && typeof payload === 'object' && 'data' in payload) ? payload.data : [];
    return Array.isArray(data) ? data : [];
}

/**
 * Public promo codes for storefront/checkout (no auth required)
 */
export async function getPublicPromocodes(companyId?: string): Promise<PromoCode[]> {
    try {
        const companyIdParam = companyId || API_CONFIG.companyId;
        if (!companyIdParam) return [];
        const params = new URLSearchParams();
        params.append("companyId", companyIdParam);
        const response = await axios.get<ApiResponse<PromoCode[]> | PromoCode[]>(
            getApiUrl(`/promocode/public?${params.toString()}`),
        );
        const payload: ApiResponse<PromoCode[]> | PromoCode[] = response.data;
        const data = Array.isArray(payload)
            ? payload
            : (payload && typeof payload === "object" && "data" in payload)
            ? (payload as ApiResponse<PromoCode[]>).data
            : [];
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error fetching public promocodes:", error);
        return [];
    }
}

/**
 * Orders
 */
export async function createOrder(
    payload: {
        customerId?: number;
        customerName?: string;
        customerPhone?: string;
        customerAddress?: string;
        shippingAddress?: string;
        paymentMethod?: "DIRECT" | "COD";
        deliveryType?: "INSIDEDHAKA" | "OUTSIDEDHAKA";
        items: { productId: number; quantity: number }[];
    },
    token: string,
    companyId?: string,
): Promise<unknown> {
    const companyIdParam = companyId || API_CONFIG.companyId;
    const response = await axios.post(
        getApiUrl(`/orders?companyId=${companyIdParam}`),
        payload,
        { headers: getApiHeaders(token) }
    );
    const responseData: ApiResponse<unknown> | unknown = response.data;
    return (responseData && typeof responseData === 'object' && 'data' in responseData)
        ? (responseData as ApiResponse<unknown>).data
        : responseData;
}

/**
 * Get all banners (public endpoint). Uses fetch so it is safe in Server Components; never throws.
 */
export async function getBanners(companyId?: string): Promise<Banner[]> {
    try {
        const companyIdParam = companyId || API_CONFIG.companyId;
        const url = getApiUrl(`/banners/public?${new URLSearchParams({ companyId: companyIdParam })}`);
        const res = await fetch(url, { next: { revalidate: 60 } });
        if (!res.ok) return [];
        const json = await res.json();
        const data = json?.data;
        return Array.isArray(data) ? data : [];
    } catch {
        console.warn("Banners: backend not accessible, using empty list.");
        return [];
    }
}

/**
 * Get top products section (public). Uses fetch so it is safe in Server Components; never throws.
 */
export async function getTopProducts(companyId?: string): Promise<TopProductsSection | null> {
    try {
        const companyIdParam = companyId || API_CONFIG.companyId;
        const url = getApiUrl(`/top-products/public?${new URLSearchParams({ companyId: companyIdParam })}`);
        const res = await fetch(url, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        const json = await res.json();
        const data = json?.data;
        if (!data || typeof data !== "object") return null;
        return {
            leftImage: data.leftImage ?? null,
            rightImage: data.rightImage ?? null,
            carouselItems: Array.isArray(data.carouselItems) ? data.carouselItems : [],
        };
    } catch {
        console.warn("Top products: backend not accessible, using null.");
        return null;
    }
}

/**
 * Update system user (e.g. reseller/company profile) by ID
 */
export async function updateSystemUser(
    id: number,
    payload: Partial<SystemUser>,
    token?: string,
    companyId?: string,
): Promise<SystemUser> {
    const companyIdParam = companyId || API_CONFIG.companyId;
    const url = companyIdParam
        ? getApiUrl(`/systemuser/${id}?companyId=${companyIdParam}`)
        : getApiUrl(`/systemuser/${id}`);

    const response = await axios.patch<ApiResponse<SystemUser> | SystemUser>(
        url,
        payload,
        token ? { headers: getApiHeaders(token) } : undefined,
    );

    const data = response.data;
    if (data && typeof data === "object" && "data" in data) {
        return (data as ApiResponse<SystemUser>).data;
    }
    return data as SystemUser;
}

