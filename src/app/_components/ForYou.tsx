import { getProducts, Product } from "../../lib/api-services";
import Link from "next/link";
import ProductCard from "../../components/ui/ProductCard";

const ForYou = async () => {
  let products: Product[] = [];

  try {
    products = await getProducts();
    // Limit to 10 products
    products = products.slice(0, 10);
  } catch (error) {
    console.error("Failed to load products:", error);
    // products will remain empty array
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-5 overflow-hidden md:pt-10 pt-5">
      <div className=" md:mb-5 mb-3 flex items-center justify-between gap-5">
        <h1 className=" sm:text-2xl text-xl font-bold text-primary">
          শুধুমাত্র আপনার জন্য
        </h1>
        <Link
          href={"/products"}
          className=" text-primary underline underline-offset-4 hover:text-blue-600 cursor-pointer transition-all font-medium"
        >
          সব পণ্য দেখুন
        </Link>
      </div>
      <div className=" grid sm:grid-cols-[repeat(auto-fit,_minmax(220px,_1fr))] grid-cols-[repeat(auto-fit,_minmax(160px,_1fr))] w-full gap-3">
        {products.map((product) => (
          <div key={product.id || product.sku}>
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
      </div>
      <div className="flex items-center justify-center">
        <Link
          href={"/products"}
          className="mt-5 text-center bg-primary hover:bg-pink-700 max-w-max text-white px-10 py-2 rounded cursor-pointer"
        >
          আরও দেখুন
        </Link>
      </div>
    </section>
  );
};

export default ForYou;
