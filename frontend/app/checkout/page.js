
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import {
  Plus,
  X,
  Trash2,
  MapPin,
  Phone,
  User,
  Pencil,
  ShoppingBag,
  Truck,
  ShieldCheck,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [deletingAddress, setDeletingAddress] = useState("");
  const [editingAddress, setEditingAddress] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [error, setError] = useState("");
  const [addressError, setAddressError] = useState("");

  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    province: "",
    postalCode: "",
    label: "Home",
  });

  // Load cart and saved addresses
  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/login");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [cartResponse, addressResponse] = await Promise.all([
          axios.get("http://https://fearless-simplicity-production-ab636cfe.up.railway.app/api/v1/cart", { headers }),
          axios.get("http://https://fearless-simplicity-production-ab636cfe.up.railway.app/api/v1/addresses", { headers }),
        ]);

        setCart(cartResponse.data.cart);
        setAddresses(addressResponse.data.addresses || []);
        setSelectedAddress("");
      } catch (error) {
        console.log("Checkout Error:", error);
        setError("Unable to load checkout details.");
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [router]);

  // Calculate subtotal
  const subtotal =
    cart?.items?.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    ) || 0;

  // Handle address form inputs
  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setAddressForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Reset address form
  const resetAddressForm = () => {
    setAddressForm({
      fullName: "",
      phone: "",
      addressLine: "",
      city: "",
      province: "",
      postalCode: "",
      label: "Home",
    });

    setEditingAddress("");
    setAddressError("");
    setShowAddressForm(false);
  };

  // Add new address
  const handleAddAddress = async (e) => {
    e.preventDefault();

    try {
      setSavingAddress(true);
      setAddressError("");

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://https://fearless-simplicity-production-ab636cfe.up.railway.app/api/v1/addresses",
        addressForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const addressResponse = await axios.get(
        "http://https://fearless-simplicity-production-ab636cfe.up.railway.app/api/v1/addresses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedAddresses = addressResponse.data.addresses || [];

      setAddresses(updatedAddresses);

      const savedAddressId =
        response.data.address?._id ||
        response.data.newAddress?._id;

      let newAddress = savedAddressId
        ? updatedAddresses.find(
            (address) => address._id === savedAddressId
          )
        : null;

      if (!newAddress) {
        newAddress = updatedAddresses.find(
          (address) =>
            address.fullName === addressForm.fullName &&
            address.phone === addressForm.phone &&
            address.addressLine === addressForm.addressLine
        );
      }

      if (newAddress) {
        setSelectedAddress(newAddress._id);
      }

      resetAddressForm();
      alert("Address added successfully!");
    } catch (error) {
      console.log("Add Address Error:", error);

      setAddressError(
        error.response?.data?.message ||
          "Unable to add address. Please try again."
      );
    } finally {
      setSavingAddress(false);
    }
  };

  // Open address form with existing details
  const startEditingAddress = (address) => {
    setAddressForm({
      fullName: address.fullName || "",
      phone: address.phone || "",
      addressLine: address.addressLine || "",
      city: address.city || "",
      province: address.province || "",
      postalCode: address.postalCode || "",
      label: address.label || "Home",
    });

    setEditingAddress(address._id);
    setShowAddressForm(true);
    setAddressError("");
  };

  // Edit saved address
  const handleEditAddress = async (e, addressId) => {
    e.preventDefault();

    try {
      setSavingAddress(true);
      setAddressError("");

      const token = localStorage.getItem("token");

      await axios.put(
        `http://https://fearless-simplicity-production-ab636cfe.up.railway.app/api/v1/addresses/${addressId}`,
        addressForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response = await axios.get(
        "http://https://fearless-simplicity-production-ab636cfe.up.railway.app/api/v1/addresses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAddresses(response.data.addresses || []);
      setSelectedAddress(addressId);

      resetAddressForm();

      alert("Address updated successfully!");
    } catch (error) {
      console.log("Edit Address Error:", error);

      setAddressError(
        error.response?.data?.message ||
          "Unable to update address."
      );
    } finally {
      setSavingAddress(false);
    }
  };

  // Remove saved address
  const handleRemoveAddress = async (addressId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this address?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingAddress(addressId);

      const token = localStorage.getItem("token");

      await axios.delete(
        `http://https://fearless-simplicity-production-ab636cfe.up.railway.app/api/v1/addresses/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAddresses((previous) =>
        previous.filter((address) => address._id !== addressId)
      );

      if (selectedAddress === addressId) {
        setSelectedAddress("");
      }

      if (editingAddress === addressId) {
        resetAddressForm();
      }

      alert("Address removed successfully!");
    } catch (error) {
      console.log("Remove Address Error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to remove address. Please try again."
      );
    } finally {
      setDeletingAddress("");
    }
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address.");
      return;
    }

    if (!cart?.items?.length) {
      alert("Your cart is empty.");
      return;
    }

    try {
      setPlacingOrder(true);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://https://fearless-simplicity-production-ab636cfe.up.railway.app/api/v1/orders",
        {
          addressId: selectedAddress,
          paymentMethod: "COD",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Your order has been placed successfully!");
        router.push("/orders");
      } else {
        alert(response.data.message || "Unable to place your order.");
      }
    } catch (error) {
      console.log("Place Order Error:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while placing your order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <>
      

      <main className="min-h-screen bg-[#f5f8f5] px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl">

          {/* Page Heading */}
          <div className="mb-9">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-green-700">
              <ShoppingBag size={17} />
              <span>OnlineMart / Checkout</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Checkout
            </h1>

            <p className="mt-2 text-gray-500">
              Complete your delivery details and place your order.
            </p>
          </div>

          {/* Checkout Steps */}
          <div className="mb-8 grid grid-cols-3 gap-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 size={21} />
              <span className="text-xs font-semibold sm:text-sm">
                Shopping Cart
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 text-green-700">
              <MapPin size={20} />
              <span className="text-xs font-semibold sm:text-sm">
                Delivery
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 text-gray-400">
              <CreditCard size={20} />
              <span className="text-xs font-semibold sm:text-sm">
                Payment
              </span>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600"></div>
              <p className="font-medium text-gray-500">
                Loading checkout details...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <p className="text-red-600">{error}</p>
            </div>
          ) : !cart?.items?.length ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <ShoppingBag
                size={50}
                className="mx-auto mb-4 text-gray-300"
              />

              <h2 className="mb-2 text-2xl font-bold text-gray-800">
                Your cart is empty
              </h2>

              <p className="mb-6 text-gray-500">
                Add some products before checking out.
              </p>

              <button
                onClick={() => router.push("/products")}
                className="rounded-xl bg-green-600 px-7 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid items-start gap-7 lg:grid-cols-3">

              {/* LEFT SECTION */}
              <div className="space-y-6 lg:col-span-2">

                {/* Delivery Address Card */}
                <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-5 sm:p-7">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                        <MapPin size={23} />
                      </div>

                      <div>
                        <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                          Delivery Address
                        </h2>

                        <p className="text-sm text-gray-500">
                          Select where you want your order delivered
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (showAddressForm) {
                          resetAddressForm();
                        } else {
                          setEditingAddress("");
                          setAddressError("");
                          setAddressForm({
                            fullName: "",
                            phone: "",
                            addressLine: "",
                            city: "",
                            province: "",
                            postalCode: "",
                            label: "Home",
                          });
                          setShowAddressForm(true);
                        }
                      }}
                      className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                    >
                      {showAddressForm ? (
                        <>
                          <X size={17} />
                          Close
                        </>
                      ) : (
                        <>
                          <Plus size={18} />
                          Add Address
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-5 sm:p-7">

                    {/* Address Form */}
                    {showAddressForm && (
                      <form
                        onSubmit={(e) =>
                          editingAddress
                            ? handleEditAddress(e, editingAddress)
                            : handleAddAddress(e)
                        }
                        className="mb-7 rounded-2xl border border-green-200 bg-green-50/70 p-5 sm:p-6"
                      >
                        <div className="mb-5 flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                            {editingAddress ? (
                              <Pencil size={19} />
                            ) : (
                              <Plus size={20} />
                            )}
                          </div>

                          <div>
                            <h3 className="font-bold text-gray-900">
                              {editingAddress
                                ? "Edit Delivery Address"
                                : "Add New Address"}
                            </h3>

                            <p className="text-xs text-gray-500">
                              Enter your complete delivery information
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">

                          {[
                            {
                              name: "fullName",
                              label: "Full Name",
                              placeholder: "Enter your full name",
                              type: "text",
                            },
                            {
                              name: "phone",
                              label: "Phone Number",
                              placeholder: "03XXXXXXXXX",
                              type: "tel",
                            },
                            {
                              name: "city",
                              label: "City",
                              placeholder: "Enter city",
                              type: "text",
                            },
                            {
                              name: "province",
                              label: "Province",
                              placeholder: "Enter province",
                              type: "text",
                            },
                            {
                              name: "postalCode",
                              label: "Postal Code",
                              placeholder: "Enter postal code",
                              type: "text",
                            },
                          ].map((field) => (
                            <div key={field.name}>
                              <label className="mb-2 block text-sm font-semibold text-gray-700">
                                {field.label}
                              </label>

                              <input
                                type={field.type}
                                name={field.name}
                                value={addressForm[field.name]}
                                onChange={handleAddressChange}
                                placeholder={field.placeholder}
                                required
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                              />
                            </div>
                          ))}

                          <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                              Address Type
                            </label>

                            <select
                              name="label"
                              value={addressForm.label}
                              onChange={handleAddressChange}
                              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                            >
                              <option value="Home">Home</option>
                              <option value="Office">Office</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                              Complete Address
                            </label>

                            <textarea
                              name="addressLine"
                              value={addressForm.addressLine}
                              onChange={handleAddressChange}
                              placeholder="House number, street, area..."
                              rows={3}
                              required
                              className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                            />
                          </div>

                        </div>

                        {addressError && (
                          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {addressError}
                          </p>
                        )}

                        <div className="mt-5 flex flex-wrap gap-3">
                          <button
                            type="submit"
                            disabled={savingAddress}
                            className="rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 disabled:opacity-50"
                          >
                            {savingAddress
                              ? "Please Wait..."
                              : editingAddress
                              ? "Update Address"
                              : "Save Address"}
                          </button>

                          <button
                            type="button"
                            onClick={resetAddressForm}
                            className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Saved Addresses */}
                    {addresses.length === 0 ? (
                      <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-5 py-12 text-center">
                        <MapPin
                          size={42}
                          className="mx-auto mb-3 text-gray-300"
                        />

                        <h3 className="font-bold text-gray-800">
                          No Address Saved
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Add your delivery address to continue.
                        </p>

                        {!showAddressForm && (
                          <button
                            onClick={() => setShowAddressForm(true)}
                            className="mt-5 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                          >
                            <span className="flex items-center gap-2">
                              <Plus size={17} />
                              Add Delivery Address
                            </span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="font-bold text-gray-800">
                            Your Saved Addresses
                          </h3>

                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                            {addresses.length} Saved
                          </span>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          {addresses.map((address) => (
                            <div
                              key={address._id}
                              onClick={() =>
                                setSelectedAddress(address._id)
                              }
                              className={`relative cursor-pointer rounded-2xl border-2 p-5 transition ${
                                selectedAddress === address._id
                                  ? "border-green-600 bg-green-50/60 shadow-md shadow-green-100"
                                  : "border-gray-100 bg-white hover:border-green-300 hover:shadow-sm"
                              }`}
                            >
                              <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                      selectedAddress === address._id
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-100 text-gray-500"
                                    }`}
                                  >
                                    <MapPin size={18} />
                                  </span>

                                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                                    {address.label || "Address"}
                                  </span>
                                </div>

                                <input
                                  type="radio"
                                  name="address"
                                  checked={
                                    selectedAddress === address._id
                                  }
                                  onChange={() =>
                                    setSelectedAddress(address._id)
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-5 w-5 accent-green-600"
                                />
                              </div>

                              <h4 className="mb-3 font-bold text-gray-900">
                                {address.fullName}
                              </h4>

                              <div className="space-y-2 text-sm text-gray-500">
                                <p className="flex items-start gap-2">
                                  <Phone
                                    size={15}
                                    className="mt-0.5 shrink-0 text-green-600"
                                  />
                                  {address.phone}
                                </p>

                                <p className="flex items-start gap-2">
                                  <MapPin
                                    size={15}
                                    className="mt-0.5 shrink-0 text-green-600"
                                  />
                                  <span>
                                    {address.addressLine}, {address.city},{" "}
                                    {address.province}
                                  </span>
                                </p>

                                <p className="pl-6">
                                  {address.postalCode}
                                </p>
                              </div>

                              <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEditingAddress(address);
                                  }}
                                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-green-200 py-2.5 text-xs font-bold text-green-700 transition hover:bg-green-50"
                                >
                                  <Pencil size={14} />
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveAddress(address._id);
                                  }}
                                  disabled={
                                    deletingAddress === address._id
                                  }
                                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                >
                                  <Trash2 size={14} />
                                  {deletingAddress === address._id
                                    ? "Removing..."
                                    : "Remove"}
                                </button>
                              </div>

                              {selectedAddress === address._id && (
                                <div className="absolute -right-2 -top-2 rounded-full bg-green-600 p-1 text-white shadow">
                                  <CheckCircle2 size={16} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                  </div>
                </section>

                {/* Payment Method */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                      <CreditCard size={22} />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Payment Method
                      </h2>

                      <p className="text-sm text-gray-500">
                        Choose how you want to pay
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-xl border-2 border-green-500 bg-green-50 p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-green-700">
                      <Truck size={23} />
                    </div>

                    <div className="flex-1">
                      <p className="font-bold text-gray-900">
                        Cash on Delivery
                      </p>

                      <p className="text-sm text-gray-500">
                        Pay when your order arrives at your doorstep.
                      </p>
                    </div>

                    <CheckCircle2
                      size={22}
                      className="text-green-600"
                    />
                  </div>
                </section>

              </div>

              {/* RIGHT SECTION - ORDER SUMMARY */}
              <aside className="lg:sticky lg:top-6">
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

                  <div className="border-b border-gray-100 p-5 sm:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                        <ShoppingBag size={21} />
                      </div>

                      <div>
                        <h2 className="text-lg font-bold text-gray-900">
                          Order Summary
                        </h2>

                        <p className="text-xs text-gray-500">
                          {cart.items.length} product(s) in your cart
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-5 sm:p-6">
                    {cart.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-start justify-between gap-3"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">
                            {item.product.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <p className="whitespace-nowrap text-sm font-bold text-gray-800">
                          Rs.{" "}
                          {item.product.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mx-5 border-t border-dashed border-gray-200 sm:mx-6"></div>

                  <div className="space-y-4 p-5 sm:p-6">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Subtotal</span>
                      <span className="font-semibold text-gray-800">
                        Rs. {subtotal}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Delivery Charges</span>
                      <span className="font-semibold text-green-600">
                        FREE
                      </span>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">
                          Total Amount
                        </span>

                        <span className="text-2xl font-extrabold text-green-700">
                          Rs. {subtotal}
                        </span>
                      </div>

                      <p className="mt-1 text-right text-xs text-gray-400">
                        Inclusive of all charges
                      </p>
                    </div>

                    <button
                      disabled={
                        !selectedAddress ||
                        addresses.length === 0 ||
                        placingOrder
                      }
                      onClick={handlePlaceOrder}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-bold text-white shadow-lg shadow-green-100 transition hover:-translate-y-0.5 hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
                    >
                      {placingOrder
                        ? "Placing Order..."
                        : "Place Your Order"}
                    </button>

                    {!selectedAddress && (
                      <p className="text-center text-xs text-red-500">
                        Please select a delivery address first.
                      </p>
                    )}

                    <button
                      onClick={() => router.push("/cart")}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 transition hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                    >
                      <ArrowLeft size={17} />
                      Back to Cart
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 border-t border-gray-100 bg-gray-50 px-4 py-4 text-xs text-gray-500">
                    <ShieldCheck size={17} className="text-green-600" />
                    Secure and safe checkout
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
