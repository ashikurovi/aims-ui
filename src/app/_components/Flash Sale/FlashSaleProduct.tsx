import EmblaCarousel from "../../../components/shared/EmblaCarousel";
import ProductCard from "../../../components/ui/ProductCard";
import { getFlashSaleProducts, Product } from "../../../lib/api-services";

const FlashSaleProduct = async () => {
  const flashSaleProducts: Product[] = await getFlashSaleProducts();

  if (!flashSaleProducts || flashSaleProducts.length === 0) {
    return null;
  }

  return (
    <div>
      <div>
        <EmblaCarousel dragFree arrowButtons>
          {flashSaleProducts.map((product) => {
            const mappedProduct = {
              id: product.id,
              name: product.name,
              sku: product.sku,
              price: product.price,
              discountPrice:
                product.flashSellPrice ?? product.discountPrice ?? product.price,
              thumbnail:
                product.thumbnail ||
                (product.images && product.images[0]
                  ? product.images[0].url
                  : undefined),
              images:
                product.images?.map((img) => ({
                  name: img.alt || "Product image",
                  url: img.url,
                })) || [],
              description: product.description,
              shortDescription: product.description,
            };

            return (
              <div
                key={mappedProduct.sku || mappedProduct.id}
                className="[flex:0_0_65%] min-[400px]:[flex:0_0_50%]  min-[500px]:[flex:0_0_45%] sm:[flex:0_0_35%] md:[flex:0_0_30%] min-[880px]:[flex:0_0_27%] lg:[flex:0_0_19%] flex flex-col justify-between gap-3 py-3 cursor-pointer select-none"
              >
                <ProductCard product={mappedProduct} />
              </div>
            );
          })}
        </EmblaCarousel>
      </div>
    </div>
  );
};

export default FlashSaleProduct;
