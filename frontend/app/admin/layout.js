"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "Products", href: "/admin/products" },
  { name: "Orders", href: "/admin/orders" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#faf7ed]">
      <div className="border-b border-[#e3e8e0] bg-white">
        <div className="mx-auto flex max-w-[1344px] items-center justify-between gap-4 px-5 py-4 md:px-[52px]">
          <div className="flex items-center gap-6">
            <Link
              href="/admin/products"
              className="text-[20px] font-bold tracking-tight text-[#175738]"
            >
              freshmart <span className="text-[13px] font-semibold text-[#6b786e]">admin</span>
            </Link>

            <nav className="flex items-center gap-2">
              {tabs.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                    pathname.startsWith(tab.href)
                      ? "bg-[#175738] text-white"
                      : "text-[#175738] hover:bg-[#e8f5e8]"
                  }`}
                >
                  {tab.name}
                </Link>
              ))}
            </nav>
          </div>

          <Link
            href="/"
            className="text-[13px] font-semibold text-[#6b786e] hover:text-[#175738]"
          >
            View store →
          </Link>
        </div>
      </div>

      {children}
    </div>
  );
}