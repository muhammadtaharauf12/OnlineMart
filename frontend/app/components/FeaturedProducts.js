"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Plus } from "lucide-react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://https://fearless-simplicity-production-ab636cfe.up.railway.app/api/v1/products"
        );

        setProducts(response.data.products || []);
      } catch (error) {
        console.log("Products Error:", error);
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Design me sirf 5 cards dikhte hain
  const availableProducts = products
    .filter((product) => product.isAvailable)
    .slice(0, 5);

  return (
  <section className="bg-[#faf7ed]">
      <div className="mx-auto max-w-[1344px] px-5 md:px-0">

        {/* Heading */}
        <div className="flex items-start justify-between gap-4 md:px-[52px]">
          <div>
            <h2 className="text-[28px] font-bold leading-tight text-[#1a241c] md:text-[32px]">
              Popular this week
            </h2>

            <p className="mt-1 text-[14px] text-[#6b786e]">
              Fresh picks our customers love.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex h-[40px] items-center rounded-full bg-[#e8f5e8] px-[14px] text-[12px] font-semibold text-[#175738] transition hover:bg-[#d8ecd8]"
          >
            Best sellers
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <p className="py-10 text-center text-[#6b786e]">
            Loading products...
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="py-10 text-center text-red-500">{error}</p>
        )}

        {/* Product Cards */}
        {!loading && !error && availableProducts.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:px-[52px] lg:grid-cols-5 lg:gap-6">
            {availableProducts.map((product) => {
              const hasDiscount =
                Number(product.oldPrice) > Number(product.price);

              const discount = hasDiscount
                ? Math.round(
                    ((product.oldPrice - product.price) / product.oldPrice) *
                      100
                  )
                : 0;

              return (
                <div
                  key={product._id}
                  className="flex flex-col rounded-[20px] bg-white p-3 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Image box */}
                  <div className="relative h-[142px] overflow-hidden rounded-[14px] bg-[#f5f2e3]">
                    <span
                      className={`absolute left-3 top-3 z-10 rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                        hasDiscount
                          ? "bg-[#fdeedd] text-[#fa8f38]"
                          : "bg-[#e8f5e8] text-[#175738]"
                      }`}
                    >
                      {hasDiscount ? `${discount}% OFF` : "FRESH"}
                    </span>

                    <img
                      src={product.image || FALLBACK_IMAGE}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="mt-4 flex flex-1 flex-col px-1">
                    <h3 className="text-[15px] font-semibold text-[#1a241c]">
                      {product.name}
                    </h3>

                    <p className="mt-1 text-[12px] text-[#6b786e]">
                      {product.unit}
                    </p>

                    {/* Price + Add */}
                    <div className="mt-auto flex items-end justify-between pt-5 pb-1">
                      <div className="flex items-baseline gap-3">
                        <span className="text-[17px] font-bold text-[#175738]">
                          Rs. {product.price}
                        </span>

                        {hasDiscount && (
                          <span className="text-[12px] text-[#6b786e]">
                            Rs. {product.oldPrice}
                          </span>
                        )}
                      </div>

                      <Link
                        href="/products"
                        aria-label={`View ${product.name}`}
                        className="flex h-[38px] w-[42px] items-center justify-center rounded-[10px] bg-[#175738] text-white transition hover:bg-[#10452b]"
                      >
                        <Plus size={18} strokeWidth={3} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && availableProducts.length === 0 && (
          <p className="py-10 text-center text-[#6b786e]">
            No products available right now.
          </p>
        )}

      </div>
    </section>
  );
}