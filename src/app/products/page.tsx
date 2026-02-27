import { Suspense } from "react";
import SideBar from "./_components/Products/products_layout/SideBar";
import TopBar from "./_components/Products/products_layout/TopBar";
import ProductsBody from "./_components/Products/ProductsBody";
import ThemeLoader from "../../components/shared/ThemeLoader";

const Products = () => {
  return (
    <Suspense
      fallback={<ThemeLoader message="পণ্য তালিকা লোড হচ্ছে..." />}
    >
      <div className="bg-gradient-to-b from-white via-pink-50/40 to-white">
        <div className="max-w-7xl mx-auto px-5">
          <div className="pt-8 pb-6 border-b border-pink-100">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div />
              <div className="w-full md:w-auto md:min-w-[220px]">
                <div className="flex justify-start md:justify-end">
                  <TopBar />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col min-[950px]:flex-row py-6 gap-6">
            <div className=" min-[950px]:block hidden w-full flex-[0_0_25%]">
              <SideBar />
            </div>
            <div className=" w-full min-[950px]:flex-[0_0_75%]">
              <ProductsBody />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Products;
