"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Search,
  UserRound,
  Asterisk,
  Menu,
  X,
} from "lucide-react";

const subscribe = (callback) => {
  window.addEventListener("storage", callback);
  window.addEventListener("auth-change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("auth-change", callback);
  };
};

const getSnapshot = () => !!localStorage.getItem("token");
const getServerSnapshot = () => false;

export default function Navbar() {
  const isLoggedIn = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const router = useRouter();

  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  // Cart count: page load, login/logout, aur cart badalne par update hota hai
  useEffect(() => {
    const fetchCartCount = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setCartCount(0);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/cart",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const items = response.data.cart?.items || [];

        setCartCount(
          items.reduce((total, item) => total + item.quantity, 0)
        );
      } catch (error) {
        console.log("Cart Count Error:", error);
        setCartCount(0);
      }
    };

    fetchCartCount();

    window.addEventListener("cart-change", fetchCartCount);
    window.addEventListener("auth-change", fetchCartCount);

    return () => {
      window.removeEventListener("cart-change", fetchCartCount);
      window.removeEventListener("auth-change", fetchCartCount);
    };
  }, []);

  // Admin check: sirf admin ko "Admin" ka link dikhega
  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAdmin(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/auth/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const user = response.data.user || response.data;

        setIsAdmin(user?.role === "admin" || user?.isAdmin === true);
      } catch (error) {
        setIsAdmin(false);
      }
    };

    checkAdmin();

    window.addEventListener("auth-change", checkAdmin);

    return () => {
      window.removeEventListener("auth-change", checkAdmin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-change"));
    alert("Logout successful!");
    router.push("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/products" },
    { name: "Fruits & Vegetables", href: "/products?category=fruits-vegetables" },
    { name: "Dairy & Eggs", href: "/products?category=dairy-eggs" },
    { name: "Bakery", href: "/products?category=bakery" },
    { name: "Beverages", href: "/products?category=beverages" },
    { name: "Offers", href: "/products?filter=offers" },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#175738] px-4 py-2.5 text-center text-[12px] font-medium text-white">
        Fresh groceries, delivered fresh to your door
        <span className="mx-2 hidden sm:inline">•</span>
        <span className="hidden sm:inline">
          Free delivery on orders over Rs. 2,500
        </span>
      </div>

      {/* Main Header */}
      <header className="border-b border-[#e3e8e0] bg-[#faf7ed]">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-5 py-6 md:px-8 lg:px-[72px]">

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#1fa83a]">
                <Asterisk size={24} strokeWidth={3} className="text-white" />
              </span>

              <div>
                <p className="text-[27px] font-bold leading-none tracking-tight text-[#175738]">
                  freshmart
                </p>
                <p className="mt-0.5 text-[8px] font-semibold tracking-[0.5px] text-[#6b786e]">
                  GOOD FOOD. GOOD MOOD.
                </p>
              </div>
            </div>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden h-12 max-w-[520px] flex-1 items-center gap-3 rounded-xl bg-white px-5 transition focus-within:ring-2 focus-within:ring-[#175738]/20 md:flex"
          >
            <Search size={20} className="shrink-0 text-[#1a241c]" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for fruits, vegetables, dairy..."
              className="w-full bg-transparent text-[14px] text-[#1a241c] outline-none placeholder:text-[#6b786e]"
            />
          </form>

          {/* Right Side */}
          <div className="hidden items-center gap-10 lg:flex">

            {/* Delivery Location */}
            <div>
              <p className="text-[10px] font-semibold tracking-wide text-[#6b786e]">
                DELIVER TO
              </p>
              <p className="text-[14px] font-semibold text-[#1a241c]">
                Karachi, Pakistan <span className="text-[8px]">▼</span>
              </p>
            </div>

            {/* Admin link (sirf admin ko) */}
            {isAdmin && (
              <Link
                href="/admin/products"
                className="text-[14px] font-semibold text-[#fa8f38] transition hover:text-[#175738]"
              >
                Admin
              </Link>
            )}

            {/* Account */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-[14px] font-semibold text-[#1a241c] transition hover:text-[#175738]"
              >
                <UserRound size={18} />
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-[14px] font-semibold text-[#1a241c] transition hover:text-[#175738]"
              >
                <UserRound size={18} />
                Account
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="flex items-center gap-2 text-[14px] font-semibold text-[#175738] transition hover:text-[#fa8f38]"
            >
              <ShoppingCart size={18} />
              Cart ({cartCount})
            </Link>
          </div>

          {/* Mobile Cart & Menu */}
          <div className="flex items-center gap-4 lg:hidden">
            <Link href="/cart" className="relative text-[#175738]">
              <ShoppingCart size={23} />

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#fa8f38] px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="text-[#175738]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenu ? <X size={25} /> : <Menu size={25} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="px-5 pb-4 md:hidden">
          <form
            onSubmit={handleSearch}
            className="flex h-11 items-center gap-3 rounded-xl bg-white px-4"
          >
            <Search size={19} className="text-[#1a241c]" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search groceries..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#6b786e]"
            />
          </form>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden border-t border-[#e3e8e0] lg:block">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-[72px] py-[18px]">
            <div className="flex items-center gap-8 pl-[188px]">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="whitespace-nowrap text-[14px] font-medium text-[#1a241c] transition hover:text-[#175738]"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <Link
              href="/products?filter=offers"
              className="whitespace-nowrap text-[14px] font-semibold text-[#fa8f38] transition hover:text-[#175738]"
            >
              Weekly deals →
            </Link>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenu && (
          <nav className="border-t border-[#e3e8e0] bg-white px-5 py-4 lg:hidden">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenu(false)}
                  className="text-sm font-medium text-[#1a241c] transition hover:text-[#175738]"
                >
                  {link.name}
                </Link>
              ))}

              <div className="my-1 border-t border-[#e3e8e0]" />

              <Link
                href="/orders"
                onClick={() => setMobileMenu(false)}
                className="text-sm font-medium text-[#1a241c]"
              >
                My Orders
              </Link>

              {isAdmin && (
                <Link
                  href="/admin/products"
                  onClick={() => setMobileMenu(false)}
                  className="text-sm font-semibold text-[#fa8f38]"
                >
                  Admin Panel
                </Link>
              )}

              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="text-left text-sm font-semibold text-red-600"
                >
                  Logout
                </button>
              ) : (
                <div className="flex gap-4">
                  <Link href="/login" className="text-sm font-semibold text-[#175738]">
                    Login
                  </Link>
                  <Link href="/register" className="text-sm font-semibold text-[#175738]">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}