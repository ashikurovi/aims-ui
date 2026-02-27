"use client";

import { PromoCode } from "../../../lib/api-services";

interface CouponCodeProps {
  promoCode: string;
  setPromoCode: (v: string) => void;
  applyPromo: () => void;
  loading?: boolean;
  appliedPromo?: PromoCode | null;
  availablePromos?: PromoCode[];
  availablePromosLoading?: boolean;
  onSelectPromo?: (code: string) => void | Promise<void>;
}

const CouponCode = ({
  promoCode,
  setPromoCode,
  applyPromo,
  loading,
  appliedPromo,
  availablePromos,
  availablePromosLoading,
  onSelectPromo,
}: CouponCodeProps) => {
  const hasAvailablePromos = (availablePromos ?? []).length > 0;
  const fallbackCode = (appliedPromo?.code || promoCode).trim();
  const showFallbackChip = !hasAvailablePromos && !!fallbackCode;

  return (
    <div className="flex flex-col gap-2">
      {/* Info text */}
      <p className="text-xs sm:text-sm text-gray-700">
        নিচের কুপনে ক্লিক করলেই কুপনটি অটো অ্যাপ্লাই হবে।
      </p>

      {availablePromosLoading && (
        <p className="text-xs text-primary">Available coupons লোড হচ্ছে...</p>
      )}

      {hasAvailablePromos && !availablePromosLoading && (
        <div className="mt-1 flex flex-wrap gap-2">
          {availablePromos!.map((promo) => {
            const isActive = appliedPromo?.code === promo.code;
            return (
              <button
                key={promo.id}
                type="button"
                onClick={() => onSelectPromo?.(promo.code)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  isActive
                    ? "bg-primary text-white border-primary"
                    : "bg-pink-50 text-pink-700 border-pink-200 hover:bg-primary/10"
                }`}
              >
                <span className="font-semibold">{promo.code}</span>
                <span className="ml-1 text-[11px] text-pink-900/80">
                  {promo.discountType === "percentage"
                    ? `${promo.discountValue}% ছাড়`
                    : `${promo.discountValue}৳ ছাড়`}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {showFallbackChip && (
        <div className="mt-1 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSelectPromo?.(fallbackCode)}
            disabled={loading}
            className="text-xs px-3 py-1 rounded-full border transition-colors bg-pink-50 text-pink-700 border-pink-200 hover:bg-primary/10 disabled:opacity-70"
          >
            <span className="font-semibold">{fallbackCode}</span>
            <span className="ml-1 text-[11px] text-pink-900/80">
              {loading ? "Applying..." : "ক্লিক করে অ্যাপ্লাই করুন"}
            </span>
          </button>
        </div>
      )}

      {appliedPromo && (
        <p className="text-sm text-green-600">
          Applied coupon: <span className="font-semibold">{appliedPromo.code}</span>
        </p>
      )}
    </div>
  );
};

export default CouponCode;
