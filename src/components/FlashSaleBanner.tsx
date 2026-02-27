import Link from "next/link";
import { IoFlash } from "react-icons/io5";
import { getFlashSaleProducts, Product } from "../lib/api-services";
import CountDown from "../app/_components/Flash Sale/CountDown";

// Show flash sale banner only when there are active flash sale products
const FlashSaleBanner = async () => {
  let flashSaleProducts: Product[] = [];

  try {
    flashSaleProducts = await getFlashSaleProducts();
  } catch (error) {
    console.error("Failed to load flash sale products for banner:", error);
  }

  if (!flashSaleProducts.length) {
    return null;
  }

  // Calculate real maximum discount percentage from active flash sale products
  const maxDiscount = flashSaleProducts.reduce((max, p) => {
    const discount =
      p.flashSellPrice && p.price
        ? Math.round(((p.price - p.flashSellPrice) / p.price) * 100)
        : 0;
    return discount > max ? discount : max;
  }, 0);

  // Calculate remaining time until nearest flash sale end time for countdown
  const now = Date.now();
  const validEndTimes = flashSaleProducts
    .map((p) =>
      p.flashSellEndTime ? new Date(p.flashSellEndTime).getTime() : null,
    )
    .filter((t): t is number => !!t && t > now);

  const nearestEndTime = validEndTimes.length
    ? Math.min(...validEndTimes)
    : null;

  const initialSecondsLeft =
    nearestEndTime && nearestEndTime > now
      ? Math.max(0, Math.floor((nearestEndTime - now) / 1000))
      : 0;

  return (
    <Link href="/flashSell" className="block">
      <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white py-3 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center justify-between gap-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <IoFlash className="text-2xl animate-pulse" />
            <div className="text-left">
              <h3 className="font-bold text-base md:text-lg">
                ⚡ ফ্ল্যাশ সেল চলছে! ⚡
              </h3>
              <p className="text-xs md:text-sm opacity-90">
                সীমিত সময়ের জন্য{" "}
                <span className="font-semibold">{maxDiscount}%</span> পর্যন্ত ছাড়!
              </p>
            </div>
          </div>
          {initialSecondsLeft > 0 && (
            <div className="hidden sm:block">
              <CountDown initialSecondsLeft={initialSecondsLeft} />
            </div>
          )}
        </div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="animate-pulse absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full"></div>
        </div>
      </div>
    </Link>
  );
};

export default FlashSaleBanner;