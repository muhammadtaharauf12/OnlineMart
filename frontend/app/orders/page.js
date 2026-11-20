
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Package, ShoppingBag, CalendarDays } from "lucide-react";


export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(
          "http://https://fearless-simplicity-production-ab636cfe.up.railway.app/api/v1/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(response.data.orders || []);
      } catch (error) {
        console.log("Orders Error:", error);
        setError(
          error.response?.data?.message || "Unable to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);
  const handleCancelOrder = async (orderId) => {
  const confirmCancel = window.confirm(
    "Are you sure you want to cancel this order?"
  );

  if (!confirmCancel) return;

  try {
    const token = localStorage.getItem("token");

    setCancellingId(orderId);

    const response = await axios.patch(
      `http://https://fearless-simplicity-production-ab636cfe.up.railway.app/api/v1/orders/${orderId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: "Cancelled" }
            : order
        )
      );

      alert("Order cancelled successfully!");
    }
  } catch (error) {
    alert(
      error.response?.data?.message || "Unable to cancel this order."
    );
  } finally {
    setCancellingId(null);
  }
};

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      case "Confirmed":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
  

      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              My Orders
            </h1>

            <p className="mt-2 text-gray-500">
              Track and manage your grocery orders.
            </p>
          </div>

          {loading ? (
            <div className="py-16 text-center text-gray-500">
              Loading your orders...
            </div>
          ) : error ? (
            <div className="rounded-xl bg-white p-8 text-center text-red-600 shadow-sm">
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-xl bg-white p-12 text-center shadow-sm">
              <ShoppingBag
                size={55}
                className="mx-auto mb-4 text-gray-300"
              />

              <h2 className="mb-2 text-xl font-bold text-gray-800">
                No Orders Yet
              </h2>

              <p className="mb-6 text-gray-500">
                You have not  placed any orders yet.
              </p>

              <button
                onClick={() => router.push("/products")}
                className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-xl bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>

                      <p className="font-semibold text-gray-800">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Order Status
                      </p>

                      <span
                        className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Payment
                      </p>

                      <p className="font-medium text-gray-800">
                        {order.paymentMethod}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Total Amount
                      </p>

                      <p className="font-bold text-green-600">
                        Rs. {order.totalAmount}
                      </p>
                    </div>
                  </div>

                  <div className="py-5">
                    <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-800">
                      <Package size={19} />
                      Ordered Products
                    </h3>

                    <div className="space-y-3">
                      {order.items?.map((item, index) => (
                        <div
                          key={item._id || index}
                          className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 p-3"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {item.name}
                            </p>

                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>

                          <p className="font-semibold text-gray-800">
                            Rs. {item.price * item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm text-gray-500">
                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} />

                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "Date unavailable"}
                    </p>

                    <p>
                      Payment Status:{" "}
                      <span className="font-semibold text-gray-700">
                        {order.paymentStatus}
                      </span>
                    </p>
                    {["Pending", "Confirmed"].includes(order.orderStatus) && (
  <button
    onClick={() => handleCancelOrder(order._id)}
    disabled={cancellingId === order._id}
    className="rounded-lg bg-red-50 px-4 py-2 font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
  >
    {cancellingId === order._id
      ? "Cancelling..."
      : "Cancel Order"}
  </button>
)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      
    </>
  );
}
