import EmblaCarousel from "../../components/shared/EmblaCarousel";
import { Banner, getBanners } from "../../lib/api-services";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const HeroCarousel: React.FC = async () => {
  const banners: Banner[] = await getBanners("COMP-000001").catch(() => []);
  const activeBanners = (banners ?? []).filter((banner: Banner) => banner.isActive);

  if (activeBanners.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl lg:mt-3 mt-0 mx-auto">
      <EmblaCarousel dotButtons autoplay>
        {activeBanners?.map((banner: Banner) => (
          <div
            key={banner.id}
            className="[flex:0_0_100%] w-full h-full relative"
          >
            <div className="relative w-full sm:aspect-[16/5] aspect-[16/7] overflow-hidden">
              <Image
                src={banner.imageUrl}
                alt={banner.title || "Banner Image"}
                width={1280}
                height={500}
                className="sm:aspect-[16/5] aspect-[16/7] "
              />
              {/* Overlay content */}
              <div className="absolute inset-0 flex flex-col items-start justify-center px-4 sm:px-8 md:px-12 lg:px-16 bg-gradient-to-r from-black/40 to-transparent">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 max-w-2xl">
                  {banner.title}
                </h2>
                {banner.subtitle && (
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-4 sm:mb-6 max-w-xl">
                    {banner.subtitle}
                  </p>
                )}
                {banner.buttonText && banner.buttonLink && (
                  <Link
                    href={banner.buttonLink}
                    className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition-colors text-sm sm:text-base"
                  >
                    {banner.buttonText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </EmblaCarousel>
    </section>
  );
};

export default HeroCarousel;
