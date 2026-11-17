
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle,
  Truck,
  Home,
} from "lucide-react";


export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingItem, setUpdatingItem] = useState("");
  const [removingItem, setRemovingItem] = useState("");

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/v1/cart",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCart(response.data.cart);
      setError("");
    } catch (error) {
      console.log("Cart Error:", error);
      setError("Unable to load your cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadCart = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/v1/cart",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!cancelled) {
          setCart(response.data.cart);
          setError("");
        }
      } catch (error) {
        if (!cancelled) {
          console.log("Cart Error:", error);
          setError("Unable to load your cart.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const updateQuantity = async (itemId, quantity) => {
    try {
      setUpdatingItem(itemId);

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/v1/cart/update/${itemId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchCart();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to update quantity"
      );
    } finally {
      setUpdatingItem("");
    }
  };

  const removeItem = async (itemId) => {
    try {
      setRemovingItem(itemId);

      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/v1/cart/remove/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchCart();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to remove product"
      );
    } finally {
      setRemovingItem("");
    }
  };

  const totalAmount =
    cart?.items?.reduce(
      (total, item) =>
        total + item.product.price * item.quantity,
      0
    ) || 0;

  const totalItems =
    cart?.items?.reduce(
      (total, item) => total + item.quantity,
      0
    ) || 0;

  return (
    <>
      <main className="min-h-screen bg-[#f8faf8]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-xs text-gray-500">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-green-700"
            >
              <Home size={13} />
              Home
            </Link>

            <span>/</span>

            <span className="flex items-center gap-1 font-medium text-green-700">
              <ShoppingBag size={13} />
              Shopping Cart
            </span>
          </div>

          {/* Heading */}
          <div className="mb-9">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Shopping Cart
            </h1>

            <p className="mt-2 text-base text-gray-500">
              Review your items and proceed to checkout
            </p>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="rounded-xl border border-gray-200 bg-white py-20 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-700" />

              <p className="mt-4 text-sm text-gray-500">
                Loading your cart...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
              <p className="text-base text-red-600">{error}</p>

              <button
                onClick={fetchCart}
                className="mt-5 rounded-md bg-green-700 px-7 py-3 text-sm font-semibold text-white hover:bg-green-800"
              >
                Try Again
              </button>
            </div>
          ) : !cart?.items?.length ? (
            /* Empty Cart */
            <div className="rounded-xl border border-gray-200 bg-white px-5 py-20 text-center">
              <ShoppingBag
                size={48}
                strokeWidth={1.3}
                className="mx-auto text-gray-400"
              />

              <h2 className="mt-5 text-2xl font-bold text-gray-900">
                Your cart is empty
              </h2>

              <p className="mt-3 text-base text-gray-500">
                Explore our products and add your favourite groceries.
              </p>

              <Link
                href="/products"
                className="mt-7 inline-flex items-center gap-2 rounded-md bg-green-700 px-7 py-3 text-sm font-semibold text-white hover:bg-green-800"
              >
                Start Shopping
                <ArrowRight size={17} />
              </Link>
            </div>
          ) : (

            /* Main Layout */
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_400px]">

              {/* LEFT SIDE: ORDER DETAILS */}
              <section className="min-w-0">
                <div className="mb-7 flex items-center justify-between">
                  <div>
                   

                    <p className="mt-2 text-sm text-gray-500">
                      Review and manage your shopping items
                    </p>
                  </div>

                  <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                    {totalItems} items
                  </span>
                </div>

                {/* Product Cards */}
                <div className="flex flex-col gap-7">
                  {cart.items.map((item) => (
                    <div
                      key={item._id}
                      className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-green-300 hover:shadow-xl sm:p-7"
                    >
                      <div className="flex gap-5">

                        {/* Product Image */}
                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-32 sm:w-32">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <h3 className="text-base font-bold text-gray-900 transition-colors duration-200 group-hover:text-green-700 sm:text-lg">
                                {item.product.name}
                              </h3>

                              <p className="mt-2 text-sm text-gray-500">
                                {item.product.category}
                              </p>

                              <p className="mt-2 text-sm font-medium text-gray-700">
                                Rs. {item.product.price} / {item.product.unit}
                              </p>
                            </div>

                            <p className="shrink-0 text-lg font-bold text-green-700">
                              Rs. {item.product.price * item.quantity}
                            </p>
                          </div>

                          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">

                            {/* Stock */}
                            <div className="flex items-center gap-2 text-sm text-green-700">
                              <CheckCircle size={16} />
                              In Stock
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-5">

                              {/* Quantity */}
                              <div className="flex items-center rounded-md border border-gray-200">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item._id,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={
                                    item.quantity <= 1 ||
                                    updatingItem === item._id
                                  }
                                  className="px-3 py-2.5 text-gray-600 transition hover:bg-green-50 hover:text-green-700 disabled:opacity-40"
                                >
                                  <Minus size={14} />
                                </button>

                                <span className="min-w-10 text-center text-sm font-semibold">
                                  {item.quantity}
                                </span>

                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item._id,
                                      item.quantity + 1
                                    )
                                  }
                                  disabled={
                                    item.quantity >= item.product.stock ||
                                    updatingItem === item._id
                                  }
                                  className="px-3 py-2.5 text-gray-600 transition hover:bg-green-50 hover:text-green-700 disabled:opacity-40"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>

                              {/* Remove */}
                              <button
                                onClick={() => removeItem(item._id)}
                                disabled={removingItem === item._id}
                                className="flex items-center gap-2 text-sm font-medium text-red-500 transition hover:text-red-700 disabled:opacity-40"
                              >
                                <Trash2 size={15} />

                                {removingItem === item._id
                                  ? "Removing"
                                  : "Remove"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/products"
                  className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition hover:gap-3 hover:text-green-900"
                >
                  <ArrowLeft size={16} />
                  Continue Shopping
                </Link>
              </section>

              {/* RIGHT SIDE: ORDER SUMMARY */}
              <aside className="lg:sticky lg:top-8">
                <div className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-lg sm:p-9">

                  <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                    <div>
                     

                      <p className="mt-2 text-sm text-gray-500">
                        Your order details
                      </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                      <ShoppingBag
                        size={23}
                        className="text-green-700"
                      />
                    </div>
                  </div>

                  {/* Summary Details */}
                  <div className="mt-9 flex flex-col gap-8">

                    {/* Subtotal */}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-base text-gray-500">
                        Subtotal ({totalItems} items)
                      </span>

                      <span className="text-lg font-semibold text-gray-900">
                        Rs. {totalAmount}
                      </span>
                    </div>

                    {/* Delivery */}
                    <div className="flex items-center justify-between">
                      <span className="text-base text-gray-500">
                        Delivery Fee
                      </span>

                      <span className="text-lg font-semibold text-green-700">
                        Free
                      </span>
                    </div>

                    {/* Total */}
                    <div className="flex flex-col gap-3 border-t border-gray-200 pt-8">
                      <span className="text-xl font-bold text-gray-900">
                        Total Amount
                      </span>

                      <span className="text-3xl font-extrabold text-green-700">
                        Rs. {totalAmount}
                      </span>
                    </div>
                  </div>

                  {/* Checkout */}
                  <button
                    onClick={() => router.push("/checkout")}
                    className="mt-9 flex w-full items-center justify-center gap-3 rounded-lg bg-green-700 py-4 text-base font-bold text-white transition duration-300 hover:bg-green-800 hover:shadow-lg"
                  >
                    Proceed to Checkout
                    <ArrowRight size={19} />
                  </button>

                  {/* Security */}
                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                    <ShieldCheck
                      size={17}
                      className="text-green-700"
                    />
                    Secure and safe checkout
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-green-300 hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                      <Truck
                        size={23}
                        className="text-green-700"
                      />
                    </div>

                    <div>
                      <p className="text-base font-semibold text-gray-900">
                        Home Delivery
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Delivery details at checkout
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>

     
    </>
  );
}
