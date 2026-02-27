import {
  getProductBySlug,
  getProductReviews,
  getRefundPolicies,
  getPublicPromocodes,
  type Product,
  type PromoCode,
} from "../../../lib/api-services";
import { API_CONFIG } from "../../../lib/api-config";
import { Suspense } from "react";
import BreadCrumb from "../_components/Product/Breadcrumb";
import ImageGallery from "../_components/Product/ImageGallery";
import ProductDetails from "../_components/Product/ProductDetails";
import RelatedProducts from "../_components/Product/RelatedProducts";
import Tab from "../_components/Product/Tabs";
import { notFound } from "next/navigation";
import { Review } from "../../../types/review";
import { ReturnPolicy } from "../../../types/return-policy";

interface CategoryProps {
  name: string;
  slug: string;
}
interface List {
  id: string;
  item: string;
}

interface ListItems {
  id: string;
  title: string;
  list: List[];
}
interface DescriptionProps {
  id: string;
  summary: string;
  list_items: ListItems[];
}
interface ImageProps {
  name: string;
  url: string;
}
interface VariantProps {
  available_quantity: number;
  id: string;
  price: number;
  size: string;
  stock_status: string;
}
interface ProductProps {
  id?: number;
  SKU: string;
  documentId: string;
  off: number;
  price: number;
  discountPrice?: number;
  title: string;
  total_sale: number;
  categories: CategoryProps[];
  description: DescriptionProps;
  images: ImageProps[];
  reviews: Review[];
  variant: VariantProps[];
  companyId?: string;
}

// Helper function to map REST API product to component format
function mapProductToComponentFormat(
  apiProduct: Product,
  reviews: Review[],
  companyId: string,
): ProductProps {
  // Determine effective selling price: flash sell > discount > base
  const effectiveDiscountPrice =
    (apiProduct as any).flashSellPrice ??
    apiProduct.discountPrice ??
    apiProduct.price;

  // Calculate discount percentage based on effective discount price
  const off =
    effectiveDiscountPrice && apiProduct.price && effectiveDiscountPrice < apiProduct.price
      ? Math.round(((apiProduct.price - effectiveDiscountPrice) / apiProduct.price) * 100)
      : 0;

  // Map images
  const images: ImageProps[] = apiProduct.images?.map((img: { url: string; alt?: string }, index: number) => ({
    name: img.alt || `Image ${index + 1}`,
    url: img.url,
  })) || [];

  // Create a single variant from the product price
  const variant: VariantProps[] = [{
    id: apiProduct.id.toString(),
    price: Number(apiProduct.price),
    size: "Default",
    available_quantity: 100, // Default value - would need to come from inventory if available
    stock_status: apiProduct.isActive ? "in_stock" : "out_of_stock",
  }];

  // Map category to categories array
  const categories: CategoryProps[] = apiProduct.category ? [{
    name: apiProduct.category.name,
    slug: apiProduct.category.slug,
  }] : [];

  // Map description
  const description: DescriptionProps = {
    id: apiProduct.id.toString(),
    summary: apiProduct.description || "",
    list_items: [],
  };

  return {
    id: apiProduct.id,
    SKU: apiProduct.sku,
    documentId: apiProduct.id.toString(),
    off,
    price: Number(apiProduct.price),
    // Use flash sell price if present; otherwise fall back to normal discount
    discountPrice:
      (apiProduct as any).flashSellPrice !== undefined &&
      (apiProduct as any).flashSellPrice !== null
        ? Number((apiProduct as any).flashSellPrice)
        : apiProduct.discountPrice
          ? Number(apiProduct.discountPrice)
          : undefined,
    title: apiProduct.name,
    total_sale: 0, // Not available in REST API
    categories,
    description,
    images,
    reviews,
    variant,
    companyId,
  };
}

const Product = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params; // here `id` will actually be the product slug/SKU

  let product: ProductProps;
  let returnPolicyContent = "";
  let promos: PromoCode[] = [];
  try {
    const companyId = API_CONFIG.companyId;
    // First fetch product by slug/SKU
    const apiProduct = await getProductBySlug(id, companyId);

    // Then in parallel: reviews (by numeric product ID), refund policies and public promo codes
    const [apiReviews, returnPolicies, publicPromos] = await Promise.all([
      getProductReviews(apiProduct.id, companyId),
      getRefundPolicies(companyId),
      getPublicPromocodes(companyId),
    ]);
    const returnPolicy = (returnPolicies as ReturnPolicy[])[0];

    // Normalize reviews to component format
    const mappedReviews: Review[] = apiReviews.map((review) => ({
      id: review.id,
      productId: review.productId ?? apiProduct.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      companyId: review.companyId ?? companyId,
      createdAt: review.createdAt,
      userName: review.userName ?? "Customer",
    }));

    product = mapProductToComponentFormat(apiProduct, mappedReviews, companyId);

    // Filter applicable promo codes for this product
    const now = new Date();
    const activePromos = publicPromos.filter((p) => {
      if (!p.isActive) return false;
      if (p.startsAt && new Date(p.startsAt) > now) return false;
      if (p.expiresAt && new Date(p.expiresAt) < now) return false;
      return true;
    });

    promos = activePromos.filter((p) => {
      if (!Array.isArray(p.productIds) || p.productIds.length === 0) {
        return true; // global promo
      }
      return p.productIds.includes(apiProduct.id);
    });

    returnPolicyContent = returnPolicy?.content || "";
  } catch (error) {
    console.error("Error fetching product:", error);
    notFound();
  }

   return (
    <Suspense
      fallback={
        <div className="min-h-[300px] flex items-center justify-center">
          <p className="text-sm text-gray-600">Product details লোড হচ্ছে...</p>
        </div>
      }
    >
      <div className="min-h-screen bg-gradient-to-b from-white via-pink-50/40 to-white">
        <section className="max-w-7xl mx-auto px-5 py-8 md:py-10">
          <div className="flex flex-col gap-5">
            {/* top breadcrumb / header section */}
            <div className="flex flex-col gap-2">
              <BreadCrumb title={product?.title} />
            </div>

            {/* main product section */}
            <div className="grid gap-5 md:gap-6 lg:grid-cols-[minmax(0,1.05fr),minmax(0,1fr)]">
              {/* image gallery */}
              <div className="rounded-2xl border border-pink-100 bg-white/90 p-3 md:p-4 flex items-center justify-center">
                <ImageGallery images={product?.images} />
              </div>

              {/* product details */}
              <div className="rounded-2xl border border-pink-100 bg-white/90 p-4 md:p-5 lg:p-6">
                <ProductDetails product={product} promos={promos} />
              </div>
            </div>

            {/* description / additional info / reviews / return policies */}
            <div className="rounded-2xl border border-pink-100 bg-white/90 sm:p-5 p-3 mt-2 overflow-hidden">
              <Tab product={product} returnPolicyContent={returnPolicyContent} />
            </div>

            {/* related products */}
            <div className="mt-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                সম্পর্কিত পণ্যসমূহ
              </h2>
              <RelatedProducts id={id} />
            </div>
          </div>
        </section>
      </div>
    </Suspense>
  );
};

export default Product;
