import Category from "./_components/Category";
import ForYou from "./_components/ForYou";
import HeroCarousel from "./_components/HeroCarousel";
import FeatureSection from "../components/FeatureSection";
import { Suspense } from "react";
import FlashSale from "./_components/Flash Sale/FlashSale";
import TopProduct from "./_components/Top Products/TopProduct";
import TrendingProducts from "./_components/TrendingProducts";
import ThemeLoader from "../components/shared/ThemeLoader";

export default function Home() {
  return (
    <Suspense
      fallback={
        <ThemeLoader fullPage message="হোম পেইজ লোড হচ্ছে, একটু অপেক্ষা করুন..." />
      }
    >
      <main>
        <HeroCarousel />
        <Category />
        <TrendingProducts />
        <TopProduct />
        <FlashSale />
        <ForYou />
        <FeatureSection />
      </main>
    </Suspense>
  );
}
