"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

const API = "http://https://fearless-simplicity-production-ab636cfe.up.railway.app/api/v1/admin/orders";

const STATUSES = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const statusStyles = {
  Pending: "bg-[#fff4e0] text-[#c77a12]",
  Confirmed: "bg-[#efeafc] text-[#6d4bd1]",
  Processing: "bg-[#fdf6d8] text-[#a58410]",
  Shipped: "bg-[#e3f0fc] text-[#1f6fb8]",
  Delivered: "bg-[#e8f5e8] text-[#175738]",
  Cancelled: "bg-red-50 text-red-600",
};

// Order me address kis naam se save hai, usko dhoondne ke liye
const getAddress = (order) =>
  order.shippingAddress || order.address || order.deliveryAddress || null;

const getCustomerName = (order) => {
  if (order.user?.firstName) {
    return `${order.user.firstName} ${order.user.lastName || ""}`.trim();
  }

  return getAddress(order)?.fullName || "Customer";
};

export default function AdminOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedId, setExpandedId] = useState("");
  const [busyId, setBusyId] = useState("");

  // Page khulne par: admin check karo, phir saare orders laao
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    let cancelled = false;

    const fetchOrders = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const meResponse = await axios.get(
          "http://https://fearless-simplicity-production-ab636cfe.up.railway.app/api/v1/auth/me",
          { headers }
        );

        const user = meResponse.data.user || meResponse.data;

        if (!(user?.role === "admin" || user?.isAdmin === true)) {
          router.push("/");
          return;
        }

        const response = await axios.get(API, { headers });

        if (!cancelled) {
          setOrders(response.data.orders || []);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          console.log("Admin Orders Error:", err);
          setError(
            err.response?.data?.message || "Unable to load orders."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, [router]);

  // ---------- Status badlo ----------
  const handleStatusChange = async (order, newStatus) => {
    if (newStatus === order.orderStatus) return;

    try {
      setBusyId(order._id);

      const token = localStorage.getItem("token");

      await axios.patch(
        `${API}/${order._id}/status`,
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((previous) =>
        previous.map((item) =>
          item._id === order._id
            ? { ...item, orderStatus: newStatus }
            : item
        )
      );
    } catch (err) {
      console.log("Update Status Error:", err);
      alert(err.response?.data?.message || "Unable to update order status.");
    } finally {
      setBusyId("");
    }
  };

  // ---------- Derived data ----------
  const countByStatus = (status) =>
    orders.filter((order) => order.orderStatus === status).length;

  const revenue = orders
    .filter((order) => order.orderStatus !== "Cancelled")
    .reduce((total, order) => total + (order.totalAmount || 0), 0);

  const searchText = search.trim().toLowerCase();

  const filteredOrders = orders.filter((order) => {
    const orderCode = order._id.slice(-8).toLowerCase();
    const customer = getCustomerName(order).toLowerCase();
    const email = (order.user?.email || "").toLowerCase();

    const matchesSearch =
      orderCode.includes(searchText) ||
      customer.includes(searchText) ||
      email.includes(searchText);

    const matchesStatus =
      statusFilter === "All" || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <section className="pb-14">
      <div className="mx-auto max-w-[1344px] px-5 pt-8 md:px-[52px]">

        <h1 className="text-[30px] font-bold leading-tight text-[#1a241c] md:text-[34px]">
          Manage orders
        </h1>
        <p className="mt-1 text-[14px] text-[#6b786e]">
          See every customer order and update its delivery status.
        </p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total orders", value: orders.length },
            { label: "Pending", value: countByStatus("Pending") },
            { label: "Delivered", value: countByStatus("Delivered") },
            { label: "Revenue", value: `Rs. ${revenue.toLocaleString()}` },
          ].map((stat) => (
            <div key={stat.label} className="rounded-[16px] bg-white p-5">
              <p className="text-[13px] text-[#6b786e]">{stat.label}</p>
              <p className="mt-1 text-[24px] font-bold text-[#175738]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {["All", ...STATUSES].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                  statusFilter === status
                    ? "bg-[#175738] text-white"
                    : "bg-white text-[#175738] hover:bg-[#e8f5e8]"
                }`}
              >
                {status}
                {status !== "All" && ` (${countByStatus(status)})`}
              </button>
            ))}
          </div>

          <div className="flex h-[48px] items-center gap-3 rounded-[12px] bg-white px-4 lg:w-[340px]">
            <Search size={18} className="text-[#6b786e]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order ID or customer..."
              className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#6b786e]"
            />
          </div>
        </div>

        {/* Orders */}
        <div className="mt-5 space-y-4">
          {loading ? (
            <p className="rounded-[20px] bg-white py-16 text-center text-[#6b786e]">
              Loading orders...
            </p>
          ) : error ? (
            <p className="rounded-[20px] bg-white py-16 text-center text-red-600">
              {error}
            </p>
          ) : filteredOrders.length === 0 ? (
            <p className="rounded-[20px] bg-white py-16 text-center text-[#6b786e]">
              No orders found.
            </p>
          ) : (
            filteredOrders.map((order) => {
              const address = getAddress(order);
              const isOpen = expandedId === order._id;

              return (
                <div key={order._id} className="rounded-[20px] bg-white p-5 md:p-6">

                  {/* Top row */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-[12px] text-[#6b786e]">Order ID</p>
                      <p className="text-[15px] font-bold text-[#1a241c]">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>

                    <div>
                      <p className="text-[12px] text-[#6b786e]">Customer</p>
                      <p className="text-[14px] font-semibold text-[#1a241c]">
                        {getCustomerName(order)}
                      </p>
                      {order.user?.email && (
                        <p className="text-[12px] text-[#6b786e]">
                          {order.user.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-[12px] text-[#6b786e]">Date</p>
                      <p className="text-[14px] text-[#1a241c]">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[12px] text-[#6b786e]">Total</p>
                      <p className="text-[16px] font-bold text-[#175738]">
                        Rs. {order.totalAmount}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-[12px] text-[#6b786e]">Status</p>
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(order, e.target.value)
                        }
                        disabled={busyId === order._id}
                        className={`h-[38px] cursor-pointer rounded-full px-4 text-[13px] font-semibold outline-none disabled:opacity-50 ${
                          statusStyles[order.orderStatus] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Details toggle */}
                  <button
                    onClick={() => setExpandedId(isOpen ? "" : order._id)}
                    className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-[#175738] hover:text-[#fa8f38]"
                  >
                    {isOpen ? "Hide details" : "View details"}
                    {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>

                  {/* Details */}
                  {isOpen && (
                    <div className="mt-4 grid gap-6 border-t border-[#e3e8e0] pt-5 md:grid-cols-2">

                      <div>
                        <h3 className="text-[14px] font-bold text-[#1a241c]">
                          Products
                        </h3>

                        <div className="mt-3 space-y-3">
                          {order.items?.map((item, index) => (
                            <div
                              key={item._id || index}
                              className="flex items-center justify-between gap-3 rounded-[12px] bg-[#faf7ed] p-3"
                            >
                              <div>
                                <p className="text-[14px] font-semibold text-[#1a241c]">
                                  {item.name}
                                </p>
                                <p className="text-[12px] text-[#6b786e]">
                                  Quantity: {item.quantity}
                                </p>
                              </div>

                              <p className="text-[14px] font-bold text-[#1a241c]">
                                Rs. {item.price * item.quantity}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <h3 className="text-[14px] font-bold text-[#1a241c]">
                            Delivery address
                          </h3>

                          {address ? (
                            <div className="mt-3 text-[14px] leading-6 text-[#6b786e]">
                              <p className="font-semibold text-[#1a241c]">
                                {address.fullName}
                              </p>
                              <p>{address.phone}</p>
                              <p>
                                {address.addressLine}, {address.city}
                                {address.province ? `, ${address.province}` : ""}
                              </p>
                              {address.postalCode && <p>{address.postalCode}</p>}
                            </div>
                          ) : (
                            <p className="mt-3 text-[14px] text-[#6b786e]">
                              Address not available.
                            </p>
                          )}
                        </div>

                        <div>
                          <h3 className="text-[14px] font-bold text-[#1a241c]">
                            Payment
                          </h3>
                          <p className="mt-3 text-[14px] text-[#6b786e]">
                            {order.paymentMethod} &bull; {order.paymentStatus}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}