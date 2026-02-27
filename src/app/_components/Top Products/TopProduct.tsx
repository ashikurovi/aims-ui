import Image from "next/image";
import TopProductCarousel from "./TopProductCarousel";
import { API_CONFIG } from "../../../lib/api-config";
import { getTopProducts } from "../../../lib/api-services";

const img_1 =
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1916&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const img_2 =
  "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const TopProduct = async () => {
  const companyId = API_CONFIG.companyId;
  const section = await getTopProducts(companyId);
  console.log("section", section);
  if (!section || (!section.leftImage && !section.rightImage && (!section.carouselItems || section.carouselItems.length === 0))) {
    return null;
  }

  const left = section.leftImage || img_1;
  const right = section.rightImage || img_2;
  const items = section.carouselItems || [];

  return (
    <section className="  max-w-7xl mx-auto px-5 md:pt-10 pt-5 overflow-hidden">
      <div className=" grid gap-3 md:grid-cols-4 grid-cols-2 w-full ">
        <div className="rounded-md overflow-hidden">
          <Image
            src={left}
            alt="img"
            width={700}
            height={700}
            className=" aspect-[18/20] h-full "
          />
        </div>
        {/* slider  */}
        <div className=" col-span-2  md:order-none order-first rounded-md overflow-hidden h-full">
          <TopProductCarousel items={items} />
        </div>
        <div className="  rounded-md overflow-hidden">
          <Image
            src={right}
            alt="img"
            width={700}
            height={700}
            className=" aspect-[18/20] h-full"
          />
        </div>
      </div>
    </section>
  );
};

export default TopProduct;
