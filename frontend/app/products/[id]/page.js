
"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

import { ShoppingCart } from "lucide-react";

function ProductDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://https://fearless-simplicity-production-ab636cfe.up.railway.app/api/v1/products/${id}`
        );

        setProduct(response.data.product);
      } catch (error) {
        console.log("Product Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first!");
        router.push("/login");
        return;
      }

      setAddingToCart(true);

      const response = await axios.post(
        "http://https://fearless-simplicity-production-ab636cfe.up.railway.app/api/v1/cart/add",
        {
          productId: product._id,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product added to cart successfully!");
      console.log("Cart Response:", response.data);

    } catch (error) {
      console.log("Add to Cart Error:", error);
      alert(
        error.response?.data?.message ||
        "Unable to add product to cart"
      );
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <>
        
        
      </>
    );
  }

  if (!product) {
    return (
      <>
        
      </>
    );
  }

  return (
    <>
    

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            <img
              src={
                product.image ||
                "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500"
              }
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500";
              }}
              className="w-full h-[400px] object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">

            <p className="text-green-700 font-semibold">
              {product.category}
            </p>

            <h1 className="text-3xl font-bold text-gray-900 mt-3">
              {product.name}
            </h1>

            <p className="text-2xl text-green-700 font-bold mt-5">
              Rs. {product.price}
            </p>

            <p className="text-gray-600 mt-6 leading-7">
              {product.description}
            </p>

            <p className="text-gray-500 mt-4">
              Unit: {product.unit}
            </p>

            <p className="text-gray-500 mt-2">
              Available Stock: {product.stock}
            </p>

            <div className="flex items-center gap-4 mt-8">

              <button
                onClick={() =>
                  setQuantity((previous) =>
                    Math.max(1, previous - 1)
                  )
                }
                disabled={quantity <= 1}
                className="border px-4 py-2 rounded-lg disabled:opacity-50"
              >
                -
              </button>

              <span className="font-semibold text-lg">
                {quantity}
              </span>

              <button
                onClick={() =>
                  setQuantity((previous) =>
                    Math.min(product.stock, previous + 1)
                  )
                }
                disabled={quantity >= product.stock}
                className="border px-4 py-2 rounded-lg disabled:opacity-50"
              >
                +
              </button>

            </div>

            <button
              onClick={handleAddToCart}
              disabled={
                !product.isAvailable ||
                product.stock < 1 ||
                addingToCart
              }
              className="flex items-center justify-center gap-2 bg-green-700 text-white py-3 rounded-lg mt-8 hover:bg-green-800 disabled:bg-gray-400"
            >
              <ShoppingCart size={20} />

              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>

          </div>
        </div>
      </section>

     
    </>
  );
}

export default function ProductDetails() {
  return (
    <Suspense
      fallback={
        <p className="text-center py-20">
          Loading product...
        </p>
      }
    >
      <ProductDetailsContent />
    </Suspense>
  );
}
