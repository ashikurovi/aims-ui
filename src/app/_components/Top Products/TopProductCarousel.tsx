"use client";
import EmblaCarousel from "../../../components/shared/EmblaCarousel";

export type TopProductCarouselItem = {
  id: number;
  title: string;
  desc: string;
  image: string;
};

const TopProductCarousel = ({
  items = [],
}: {
  items?: TopProductCarouselItem[];
}) => {
  return (
    <EmblaCarousel dotButtons autoplay>
      {items.map((item) => (
        <div
          key={item.id}
          className="[flex:0_0_100%] w-full h-full bg-cover bg-no-repeat bg-center md:aspect-[20/11] aspect-[16/6]"
          style={{
            backgroundImage: `url(${item.image})`,
          }}
        >
          <div className=" bg-black/30 text-white sm:p-10 p-6 h-full w-full">
            <h1 className=" lg:text-4xl min-[980px]:text-3xl md:text-2xl min-[550px]:text-3xl text-2xl font-bold">
              {item.title}
            </h1>
            <p className="mt-3 min-[980px]:text-base md:text-sm min-[550px]:text-base min-[500px]:text-sm text-xs">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </EmblaCarousel>
  );
};

export default TopProductCarousel;
