"use client";
import { useCart } from "../../context/CartContext";
import formatteeNumber from "../../utils/formatteNumber";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { IoCartOutline } from "react-icons/io5";
import { TbCurrencyTaka } from "react-icons/tb";

interface Image {
  name: string;
  url: string;
}

interface Review {
  rating?: number; // Optional because the reviews array may be empty
}

interface Variant {
  price: number;
  size: string;
  available_quantity: number;
  stock_status: string;
}

interface ProductProps {
  id?: number;
  name?: string;
  title?: string;
  documentId?: string;
  off?: number;
  SKU?: string;
  sku?: string;
  price?: number | string;
  discountPrice?: number | string;
  thumbnail?: string;
  description?: string;
  shortDescription?: string;
  reviews?: Review[]; // Array of reviews
  images?: Image[]; // Array of images
  variant?: Variant[]; // Array of price variants
}

const ProductCard = ({ product }: { product: ProductProps }) => {
  const { addCartItem } = useCart();
  const router = useRouter();

  const getNumericProductId = () => {
    if (typeof product?.id === "number") return product.id;
    if (product?.documentId) {
      const parsed = Number(product.documentId);
      if (!Number.isNaN(parsed)) return parsed;
    }
    return undefined;
  };

  const getProductSlug = () => {
    return (
      product?.sku ||
      product?.SKU ||
      (product?.id ? String(product.id) : undefined)
    );
  };

  // Calculate discount percentage from price and discountPrice
  const calculateDiscountPercentage = () => {
    const originalPrice = Number(
      product?.price || product?.variant?.[0]?.price || 0,
    );
    const discountedPrice = Number(product?.discountPrice || 0);

    if (
      originalPrice > 0 &&
      discountedPrice > 0 &&
      discountedPrice < originalPrice
    ) {
      return Math.round(
        ((originalPrice - discountedPrice) / originalPrice) * 100,
      );
    }

    // Fallback to off if provided
    return product?.off || 0;
  };

  // Get the final price to display (discountPrice if available, otherwise original price)
  const getFinalPrice = () => {
    const discountedPrice = Number(product?.discountPrice || 0);
    const originalPrice = Number(
      product?.price || product?.variant?.[0]?.price || 0,
    );

    // If discountPrice exists and is valid, use it; otherwise use original price
    return discountedPrice > 0 && discountedPrice < originalPrice
      ? discountedPrice
      : originalPrice;
  };

  // Get the original price for strikethrough
  const getOriginalPrice = () => {
    const originalPrice = Number(
      product?.price || product?.variant?.[0]?.price || 0,
    );
    const discountedPrice = Number(product?.discountPrice || 0);

    // Only show strikethrough if there's a valid discount
    if (discountedPrice > 0 && discountedPrice < originalPrice) {
      return originalPrice;
    }
    return 0; // Don't show strikethrough if no discount
  };

  const available_variant =
    product?.variant?.filter((i) => i.available_quantity > 0) || [];

  const handleAddProduct = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    event.preventDefault();

    const productId = getNumericProductId();
    if (!productId) {
      toast.error("Product ID not found");
      return;
    }

    if (available_variant && available_variant.length > 0) {
      try {
        await addCartItem(Number(productId), 1);
        toast.success("Product added to cart!");
      } catch {
        toast.error("Failed to add product to cart");
      }
    } else if (product?.price !== undefined) {
      // If no variant but product has price, allow adding
      try {
        await addCartItem(Number(productId), 1);
        toast.success("Product added to cart!");
      } catch {
        toast.error("Failed to add product to cart");
      }
    } else {
      toast.error("Product is out of stock!");
    }
  };

  const handleBuyNow = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    const slug = getProductSlug();
    if (slug) {
      router.push(`/products/${slug}`);
    }
  };

  const imgSrc =
    (product?.thumbnail && product.thumbnail.trim()) ||
    product?.images?.[0]?.url;

  const productDescription =
    product?.shortDescription || product?.description || "";

  return (
    <Link
      href={`/products/${getProductSlug()}`}
      className="group/product relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-2xl bg-gray-50">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={product?.name || product?.title || "Product"}
            width={500}
            height={500}
            className="aspect-[7/5] w-full object-cover transition-transform duration-300 ease-out group-hover/product:scale-[1.05]"
          />
        ) : (
          <div
            className="aspect-[7/5] bg-gray-200 flex items-center justify-center text-gray-400 text-sm"
            aria-hidden
          >
            No image
          </div>
        )}
        {calculateDiscountPercentage() > 0 && (
          <div className="absolute top-3 left-3 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
            save {calculateDiscountPercentage()}%
          </div>
        )}
        <button
          onClick={handleAddProduct}
          className="absolute top-3 right-3 inline-flex items-center justify-center rounded-full border border-gray-100 bg-white p-1.5 text-gray-700 shadow-sm transition-colors duration-150 hover:bg-primary hover:text-white"
        >
          <IoCartOutline size={18} />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-3.5 pb-3.5 pt-3">
        <h2 className="text-sm sm:text-[15px] font-semibold text-gray-900 line-clamp-2">
          {product?.title || product?.name}
        </h2>

        {productDescription && (
          <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-2">
            {productDescription}
          </p>
        )}

        <div className="mt-1 flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-1 text-primary">
            <span className="text-[22px] sm:text-[26px] leading-none">
              <TbCurrencyTaka />
            </span>
            <span className="text-lg sm:text-xl font-bold leading-none">
              {formatteeNumber(getFinalPrice())}
            </span>
            {getOriginalPrice() > 0 && (
              <span className="ml-1 flex items-center gap-0.5 text-[11px] sm:text-[12px] text-gray-500">
                <TbCurrencyTaka size={13} />
                <span className="line-through">
                  {formatteeNumber(getOriginalPrice())}
                </span>
              </span>
            )}
          </div>

          <button
            onClick={handleBuyNow}
            className="inline-flex items-center justify-center rounded-full bg-primary px-3 py-1.5 text-[10px] sm:text-xs font-medium text-white shadow-sm transition-colors duration-200 hover:bg-black"
          >
            <span>এখনই কিনুন</span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
