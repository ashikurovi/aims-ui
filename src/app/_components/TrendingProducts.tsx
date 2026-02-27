import { getTrendingProducts, Product } from "../../lib/api-services";
import { API_CONFIG } from "../../lib/api-config";
import EmblaCarousel from "../../components/shared/EmblaCarousel";
import ProductCard from "../../components/ui/ProductCard";

const TrendingProducts = async () => {
  const products: Product[] = await getTrendingProducts(30, 10, API_CONFIG.companyId).catch(() => []);
  const list = products ?? [];

  if (list.length === 0) {
    return null;
  }

  return (
    <section className=" max-w-7xl mx-auto px-5 md:pt-10 pt-5 ">
      <h1 className=" sm:text-2xl text-xl font-bold text-primary">
        ট্রেন্ডিং পণ্য
      </h1>
      <div>
        <EmblaCarousel dragFree arrowButtons>
          {list.map((product) => (
            <div
              key={product.id || product.sku}
              className="[flex:0_0_65%] min-[400px]:[flex:0_0_50%]  min-[500px]:[flex:0_0_45%] sm:[flex:0_0_35%] md:[flex:0_0_30%] min-[880px]:[flex:0_0_27%] lg:[flex:0_0_19%] flex flex-col justify-between gap-3 py-3 cursor-pointer select-none"
            >
              <ProductCard product={{
                id: product.id,
                name: product.name,
                title: product.name,
                documentId: product.id?.toString(),
                sku: product.sku,
                price: product.price,
                discountPrice: product.discountPrice,
                thumbnail: product.thumbnail,
                images: product.images?.map(img => ({ name: img.alt || 'Product image', url: img.url })) || [],
                description: product.description,
                shortDescription: product.description,
                reviews: [],
              }} />
            </div>
          ))}
        </EmblaCarousel>
      </div>
    </section>
  );
};

export default TrendingProducts;
