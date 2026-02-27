import { getFlashSaleProducts, Product } from "../../../lib/api-services";
import CountDown from "./CountDown";
import FlashSaleProduct from "./FlashSaleProduct";

const FlashSale = async () => {
  let flashSaleProducts: Product[] = [];

  try {
    flashSaleProducts = await getFlashSaleProducts();
  } catch (error) {
    console.error("Failed to load flash sale products:", error);
    // flashSaleProducts will remain empty array
  }

  // If there are no flash sale products, don't show the section
  if (flashSaleProducts.length === 0) {
    return null;
  }

  // Calculate maximum discount from flash sale products (real % off)
  const maxDiscount =
    flashSaleProducts.length > 0
      ? flashSaleProducts.reduce((max, p) => {
          const discount =
            p.flashSellPrice && p.price
              ? Math.round(((p.price - p.flashSellPrice) / p.price) * 100)
              : 0;
          return discount > max ? discount : max;
        }, 0)
      : 0;

  // Find the nearest flash sell end time to show in countdown
  const now = Date.now();
  const validEndTimes = flashSaleProducts
    .map((p) => (p.flashSellEndTime ? new Date(p.flashSellEndTime).getTime() : null))
    .filter((t): t is number => !!t && t > now);

  const nearestEndTime = validEndTimes.length
    ? Math.min(...validEndTimes)
    : null;

  const initialSecondsLeft =
    nearestEndTime && nearestEndTime > now
      ? Math.max(0, Math.floor((nearestEndTime - now) / 1000))
      : 0;

  return (
    <section className=" max-w-7xl mx-auto px-5 md:pt-10 pt-5 ">
      <div
        className="rounded-md overflow-hidden bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(/images/payment-gateway.webp)`,
        }}
      >
        <div className=" bg-black/30 backdrop-blur-md sm:p-8 p-5 flex flex-col gap-3">
          <div className=" flex justify-between sm:gap-5 gap-2 flex-col sm:flex-row">
            <div className="text-white">
              <h2 className=" sm:text-2xl text-xl font-bold">ফ্ল্যাশ সেল</h2>
              <p className=" sm:text-sm text-xs">
                {`${maxDiscount}% পর্যন্ত ফ্ল্যাশ সেল ডিল উপভোগ করুন!`}
              </p>
            </div>
            <div>
              <CountDown initialSecondsLeft={initialSecondsLeft} />
            </div>
          </div>
          <div>
            <FlashSaleProduct />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlashSale;
