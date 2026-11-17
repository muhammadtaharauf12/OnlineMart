"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Search, X, ArrowLeft } from "lucide-react";

const API = "http://localhost:5000/api/v1/products";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500";

const emptyForm = {
  name: "",
  description: "",
  category: "",
  unit: "piece",
  price: "",
  oldPrice: "",
  stock: "",
  image: "",
  isAvailable: true,
};

export default function AdminProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [busyId, setBusyId] = useState("");

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // Save, delete ya update ke baad list dobara laane ke liye
  const reloadProducts = async () => {
    try {
      const response = await axios.get(API);
      setProducts(response.data.products || []);
      setError("");
    } catch (err) {
      console.log("Admin Products Error:", err);
      setError("Unable to load products.");
    }
  };

  // Page khulne par: admin check karo, phir products laao
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    let cancelled = false;

    const fetchProducts = async () => {
      try {
        const meResponse = await axios.get(
          "http://localhost:5000/api/v1/auth/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const user = meResponse.data.user || meResponse.data;

        if (!(user?.role === "admin" || user?.isAdmin === true)) {
          router.push("/");
          return;
        }

        const response = await axios.get(API);

        if (!cancelled) {
          setProducts(response.data.products || []);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          console.log("Admin Products Error:", err);
          setError("Unable to load products.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [router]);

  // ---------- Form helpers ----------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openAddForm = () => {
    setEditingId("");
    setForm(emptyForm);
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      unit: product.unit || "piece",
      price: product.price ?? "",
      oldPrice: product.oldPrice ?? "",
      stock: product.stock ?? "",
      image: product.image || "",
      isAvailable: product.isAvailable ?? true,
    });
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId("");
    setForm(emptyForm);
    setFormError("");
  };

  const handleApiError = (err, fallback) => {
    const status = err.response?.status;

    if (status === 401 || status === 403) {
      return "You do not have admin access. Please login with an admin account.";
    }

    return err.response?.data?.message || fallback;
  };

  // ---------- Save (add / update) ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      unit: form.unit.trim() || "piece",
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image.trim(),
      isAvailable: form.isAvailable,
    };

    if (form.oldPrice !== "") {
      payload.oldPrice = Number(form.oldPrice);
    }

    try {
      setSaving(true);
      setFormError("");

      if (editingId) {
        await axios.put(`${API}/${editingId}`, payload, {
          headers: getHeaders(),
        });
      } else {
        await axios.post(API, payload, { headers: getHeaders() });
      }

      await reloadProducts();
      closeForm();
    } catch (err) {
      console.log("Save Product Error:", err);
      setFormError(handleApiError(err, "Unable to save product."));
    } finally {
      setSaving(false);
    }
  };

  // ---------- Delete ----------
  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      setBusyId(product._id);

      await axios.delete(`${API}/${product._id}`, {
        headers: getHeaders(),
      });

      setProducts((previous) =>
        previous.filter((item) => item._id !== product._id)
      );
    } catch (err) {
      console.log("Delete Product Error:", err);
      alert(handleApiError(err, "Unable to delete product."));
    } finally {
      setBusyId("");
    }
  };

  // ---------- Available / Hidden toggle ----------
  const toggleAvailability = async (product) => {
    try {
      setBusyId(product._id);

      await axios.put(
        `${API}/${product._id}`,
        { isAvailable: !product.isAvailable },
        { headers: getHeaders() }
      );

      setProducts((previous) =>
        previous.map((item) =>
          item._id === product._id
            ? { ...item, isAvailable: !item.isAvailable }
            : item
        )
      );
    } catch (err) {
      console.log("Toggle Error:", err);
      alert(handleApiError(err, "Unable to update product."));
    } finally {
      setBusyId("");
    }
  };

  // ---------- Derived data ----------
  const searchText = search.trim().toLowerCase();

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchText) ||
      (product.category || "").toLowerCase().includes(searchText)
  );

  const existingCategories = [
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  const outOfStock = products.filter((product) => product.stock <= 0).length;
  const availableCount = products.filter((product) => product.isAvailable).length;

  const inputClass =
    "h-[46px] w-full rounded-[12px] border border-[#e3e8e0] bg-[#faf7ed] px-4 text-[14px] text-[#1a241c] outline-none transition placeholder:text-[#6b786e] focus:border-[#175738] focus:ring-2 focus:ring-[#175738]/10";

  return (
    <section className="min-h-screen bg-[#faf7ed] pb-14">
      <div className="mx-auto max-w-[1344px] px-5 pt-8 md:px-[52px]">

        {/* Top bar */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#175738] hover:text-[#fa8f38]"
        >
          <ArrowLeft size={15} />
          Back to store
        </Link>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[30px] font-bold leading-tight text-[#1a241c] md:text-[34px]">
              Manage products
            </h1>
            <p className="mt-1 text-[14px] text-[#6b786e]">
              Add, edit and remove the products shown in your store.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="inline-flex h-[46px] items-center justify-center gap-2 rounded-[12px] bg-[#175738] px-6 text-[14px] font-semibold text-white transition hover:bg-[#10452b]"
          >
            <Plus size={17} />
            Add product
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Total products", value: products.length },
            { label: "Available", value: availableCount },
            { label: "Out of stock", value: outOfStock },
          ].map((stat) => (
            <div key={stat.label} className="rounded-[16px] bg-white p-5">
              <p className="text-[13px] text-[#6b786e]">{stat.label}</p>
              <p className="mt-1 text-[26px] font-bold text-[#175738]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mt-6 flex h-[48px] items-center gap-3 rounded-[12px] bg-white px-4 md:max-w-[420px]">
          <Search size={18} className="text-[#6b786e]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or category..."
            className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#6b786e]"
          />
        </div>

        {/* Table */}
        <div className="mt-5 overflow-hidden rounded-[20px] bg-white">
          {loading ? (
            <p className="py-16 text-center text-[#6b786e]">
              Loading products...
            </p>
          ) : error ? (
            <p className="py-16 text-center text-red-600">{error}</p>
          ) : filteredProducts.length === 0 ? (
            <p className="py-16 text-center text-[#6b786e]">
              No products found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-[14px]">
                <thead>
                  <tr className="border-b border-[#e3e8e0] text-[12px] font-semibold uppercase tracking-wide text-[#6b786e]">
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4">Stock</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-[#e3e8e0] last:border-0"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-[52px] w-[52px] shrink-0 overflow-hidden rounded-[12px] bg-[#f5f2e3]">
                            <img
                              src={product.image || FALLBACK_IMAGE}
                              alt={product.name}
                              onError={(e) => {
                                e.currentTarget.src = FALLBACK_IMAGE;
                              }}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div>
                            <p className="font-semibold text-[#1a241c]">
                              {product.name}
                            </p>
                            <p className="text-[12px] text-[#6b786e]">
                              {product.unit}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-[#1a241c]">
                        {product.category}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-bold text-[#175738]">
                          Rs. {product.price}
                        </p>
                        {Number(product.oldPrice) > Number(product.price) && (
                          <p className="text-[12px] text-[#6b786e] line-through">
                            Rs. {product.oldPrice}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={
                            product.stock <= 0
                              ? "font-semibold text-red-600"
                              : "text-[#1a241c]"
                          }
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => toggleAvailability(product)}
                          disabled={busyId === product._id}
                          title="Click to change"
                          className={`rounded-full px-3 py-1 text-[12px] font-semibold transition disabled:opacity-50 ${
                            product.isAvailable
                              ? "bg-[#e8f5e8] text-[#175738] hover:bg-[#d8ecd8]"
                              : "bg-red-50 text-red-600 hover:bg-red-100"
                          }`}
                        >
                          {product.isAvailable ? "Available" : "Hidden"}
                        </button>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditForm(product)}
                            className="flex h-[36px] items-center gap-1.5 rounded-[10px] border border-[#e3e8e0] px-3 text-[13px] font-semibold text-[#175738] transition hover:bg-[#e8f5e8]"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(product)}
                            disabled={busyId === product._id}
                            className="flex h-[36px] items-center gap-1.5 rounded-[10px] border border-red-200 px-3 text-[13px] font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-10">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[640px] rounded-[24px] bg-white p-6 md:p-8"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[22px] font-bold text-[#1a241c]">
                  {editingId ? "Edit product" : "Add new product"}
                </h2>
                <p className="mt-1 text-[13px] text-[#6b786e]">
                  Fill in the product details below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                aria-label="Close"
                className="text-[#6b786e] hover:text-[#1a241c]"
              >
                <X size={22} />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div className="sm:col-span-2">
                <label className="mb-2 block text-[13px] font-semibold text-[#1a241c]">
                  Product name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Fresh Strawberries"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-[13px] font-semibold text-[#1a241c]">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Short description of the product"
                  className="w-full resize-none rounded-[12px] border border-[#e3e8e0] bg-[#faf7ed] px-4 py-3 text-[14px] text-[#1a241c] outline-none transition placeholder:text-[#6b786e] focus:border-[#175738] focus:ring-2 focus:ring-[#175738]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-[#1a241c]">
                  Category
                </label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  list="category-options"
                  placeholder="e.g. Fruits & Veg"
                  className={inputClass}
                />
                <datalist id="category-options">
                  {existingCategories.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-[#1a241c]">
                  Unit
                </label>
                <input
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  placeholder="e.g. 1 kg, 250g pack, dozen"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-[#1a241c]">
                  Price (Rs.)
                </label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="450"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-[#1a241c]">
                  Old price (optional)
                </label>
                <input
                  type="number"
                  name="oldPrice"
                  min="0"
                  value={form.oldPrice}
                  onChange={handleChange}
                  placeholder="520"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-[#1a241c]">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  placeholder="30"
                  className={inputClass}
                />
              </div>

              <div className="flex items-end">
                <label className="flex h-[46px] cursor-pointer items-center gap-3 text-[14px] font-semibold text-[#1a241c]">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={form.isAvailable}
                    onChange={handleChange}
                    className="h-5 w-5 accent-[#175738]"
                  />
                  Show in store
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-[13px] font-semibold text-[#1a241c]">
                  Image URL
                </label>
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className={inputClass}
                />

                {form.image && (
                  <div className="mt-3 h-[90px] w-[90px] overflow-hidden rounded-[12px] bg-[#f5f2e3]">
                    <img
                      src={form.image}
                      alt="Preview"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {formError && (
              <p className="mt-4 rounded-[10px] bg-red-50 p-3 text-[13px] text-red-600">
                {formError}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="h-[46px] rounded-[12px] bg-[#175738] px-7 text-[14px] font-semibold text-white transition hover:bg-[#10452b] disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update product"
                  : "Add product"}
              </button>

              <button
                type="button"
                onClick={closeForm}
                className="h-[46px] rounded-[12px] border border-[#e3e8e0] px-6 text-[14px] font-semibold text-[#6b786e] transition hover:bg-[#faf7ed]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}