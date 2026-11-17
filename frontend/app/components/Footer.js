"use client";

import { useState } from "react";
import Link from "next/link";

const columns = [
  {
    title: "FRESHMART",
    links: [
      { name: "Fruits & Veg", href: "/products?category=fruits-veg" },
      { name: "Dairy & Eggs", href: "/products?category=dairy-eggs" },
      { name: "Bakery", href: "/products?category=bakery" },
      { name: "Meat & Seafood", href: "/products?category=meat-seafood" },
      { name: "Drinks", href: "/products?category=drinks" },
    ],
  },
  {
    title: "ABOUT",
    links: [
      { name: "Shop", href: "/products" },
      { name: "Weekly Deals", href: "/products" },
      { name: "Delivery Info", href: "/delivery" },
      { name: "Reviews", href: "/reviews" },
    ],
  },
  {
    title: "SUPPORT",
    links: [
      { name: "Contact Us", href: "/contact" },
      { name: "FAQs", href: "/faqs" },
      { name: "Order Tracking", href: "/orders" },
      { name: "Return Policy", href: "/returns" },
    ],
  },
  {
    title: "ACCOUNT",
    links: [
      { name: "My Account", href: "/login" },
      { name: "Orders", href: "/orders" },
      { name: "Cart", href: "/cart" },
      { name: "Register", href: "/register" },
    ],
  },
];

const policies = [
  { name: "Terms of Use", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Delivery Policy", href: "/delivery" },
  { name: "Return Policy", href: "/returns" },
];

function SocialIcon({ label, href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-[#faf7ed] transition hover:text-[#fa8f38]"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    // TODO: yahan apni newsletter API call lagao
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-[#faf7ed]">
      <div className="overflow-hidden rounded-t-[40px] bg-[#175738]">

        <div className="mx-auto max-w-[1344px] px-6 pt-14 md:px-[52px] md:pt-[72px]">

          {/* Top: Newsletter + Link Columns */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_auto] lg:gap-20">

            {/* Newsletter */}
            <div className="max-w-[560px]">
              <h2 className="text-[26px] font-bold leading-[1.3] text-[#faf7ed] md:text-[30px]">
                Get a first peek at weekly deals, fresh arrivals, and easy
                recipes, straight to your inbox.
              </h2>

              <form
                onSubmit={handleSubscribe}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address.."
                  className="h-[50px] flex-1 rounded-[12px] bg-white px-5 text-[15px] text-[#1a241c] outline-none placeholder:text-[#6b786e] focus:ring-2 focus:ring-[#fa8f38]"
                />

                <button
                  type="submit"
                  className="h-[50px] rounded-[12px] border border-[#faf7ed]/60 px-8 text-[14px] font-bold tracking-[1.5px] text-[#faf7ed] transition hover:bg-[#faf7ed] hover:text-[#175738]"
                >
                  SIGN UP
                </button>
              </form>

              {subscribed && (
                <p className="mt-3 text-[13px] text-[#e8f5e8]">
                  Thank you! You are subscribed.
                </p>
              )}
            </div>

            {/* Link Columns */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-4 lg:gap-x-14">
              {columns.map((column) => (
                <div key={column.title}>
                  <h3 className="text-[14px] font-bold tracking-[2px] text-[#faf7ed]">
                    {column.title}
                  </h3>

                  <ul className="mt-5 space-y-4">
                    {column.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-[15px] text-[#faf7ed]/80 transition hover:text-[#fa8f38]"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="mt-16 flex flex-col items-start justify-between gap-6 md:mt-20 lg:flex-row lg:items-center">

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] text-[#faf7ed]/80">
              <span>
                © <strong className="text-[#faf7ed]">FreshMart 2026</strong>
              </span>

              {policies.map((policy) => (
                <span key={policy.name} className="flex items-center gap-3">
                  <span aria-hidden="true">·</span>
                  <Link
                    href={policy.href}
                    className="transition hover:text-[#fa8f38]"
                  >
                    {policy.name}
                  </Link>
                </span>
              ))}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-6">
              <SocialIcon label="Facebook" href="https://facebook.com">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </SocialIcon>

              <SocialIcon label="Instagram" href="https://instagram.com">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </SocialIcon>

              <SocialIcon label="X (Twitter)" href="https://x.com">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialIcon>
            </div>
          </div>
        </div>

        {/* Big Brand Name */}
        <div
          aria-hidden="true"
          className="mt-10 select-none overflow-hidden whitespace-nowrap text-center text-[18vw] font-extrabold leading-[0.8] tracking-tighter text-[#2f7a52]"
        >
          <span className="relative top-[0.08em] block">freshmart</span>
        </div>

      </div>
    </footer>
  );
}