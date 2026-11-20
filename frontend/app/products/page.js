"use client";

import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Search } from "lucide-react";

// URL ka category slug -> heading ka naam + database ki category me kaunse words dhoondne hain
const CATEGORY_MAP = {
  "fruits-vegetables": {
    label: "Fruits & Vegetables",
    keywords: ["fruit", "veg"],
  },
  "fruits-veg": { label: "Fruits & Veg", keywords: ["fruit", "veg"] },
  fruits: { label: "Fresh Fruits", keywords: ["fruit"] },
  vegetables: { label: "Vegetables", keywords: ["veg"] },
  "dairy-eggs": {
    label: "Dairy & Eggs",
    keywords: ["dairy", "egg", "milk"],
  },
  dairy: { label: "Dairy Products", keywords: ["dairy", "milk"] },
  bakery: { label: "Bakery", keywords: ["bakery", "bread"] },
  beverages: {
    label: "Beverages",
    keywords: ["beverage", "drink", "juice"],
  },
  drinks: { label: "Drinks", keywords: ["drink", "beverage", "juice"] },
  snacks: { label: "Snacks", keywords: ["snack"] },
  "meat-seafood": {
    label: "Meat & Seafood",
    keywords: ["meat", "seafood", "fish", "chicken"],
  },
};

function ProductsContent({ initialSearch, categorySlug, offersOnly }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState("All");

  const categoryInfo = CATEGORY_MAP[categorySlug];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://fearless-simplicity-production-ab636cfe.up.railway.app/api/v1/products"
        );

        setProducts(response.data.products || []);
      } catch (error) {
        console.log("Products Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const searchText = search.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const productCategory = (product.category || "").toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(searchText) ||
      productCategory.includes(searchText);

    const matchesDropdown =
      category === "All" || product.category === category;

    // Navbar / home page ki category se aaya hua filter
    const matchesUrlCategory = categoryInfo
      ? categoryInfo.keywords.some((word) => productCategory.includes(word))
      : true;

    // Offers: jin products ka purana price zyada hai
    const matchesOffers = offersOnly
      ? Number(product.oldPrice) > Number(product.price)
      : true;

    return (
      matchesSearch &&
      matchesDropdown &&
      matchesUrlCategory &&
      matchesOffers &&
      product.isAvailable
    );
  });

  let heading = "All Products";

  if (initialSearch) {
    heading = `Results for "${initialSearch}"`;
  } else if (offersOnly) {
    heading = "Offers & Weekly Deals";
  } else if (categoryInfo) {
    heading = categoryInfo.label;
  }

  return (
    <>
      <section className="bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-gray-900">{heading}</h1>
          <p className="text-gray-600 mt-2">
            Explore our fresh and quality grocery products.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">

          <div className="flex items-center border rounded-lg px-4 py-3 w-full md:w-96">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none ml-3 w-full"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg px-4 py-3"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

        </div>

        {loading ? (
          <p className="text-center py-12">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center py-12 text-gray-500">
            {offersOnly
              ? "No offers available right now."
              : searchText
              ? `No products found for "${search}".`
              : "No products found."}
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="border rounded-xl overflow-hidden hover:shadow-lg transition bg-white"
              >
                <img
                  src={product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500"}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500";
                  }}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4">
                  <p className="text-sm text-gray-500">
                    {product.category}
                  </p>

                  <h2 className="font-semibold mt-2">
                    {product.name}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {product.unit}
                  </p>

                  <p className="text-green-700 font-bold mt-3">
                    Rs. {product.price}
                  </p>

                  <Link
                    href={`/products/${product._id}`}
                    className="block text-center bg-green-700 text-white py-2 rounded-lg mt-4 hover:bg-green-800"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

// URL se search, category aur offers padhta hai.
// URL badalne par key badalti hai, is liye page fresh shuru hota hai.
function ProductsRouter() {
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get("search") || "";
  const categorySlug = searchParams.get("category") || "";
  const offersOnly = searchParams.get("filter") === "offers";

  return (
    <ProductsContent
      key={`${urlSearch}|${categorySlug}|${offersOnly}`}
      initialSearch={urlSearch}
      categorySlug={categorySlug}
      offersOnly={offersOnly}
    />
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={<p className="py-12 text-center">Loading products...</p>}
    >
      <ProductsRouter />
    </Suspense>
  );
}