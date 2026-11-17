"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

const hideLayoutOn = ["/login", "/register", "/admin"];

export default function LayoutShell({ children }) {
  const pathname = usePathname() || "";

  const hideLayout = hideLayoutOn.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (hideLayout) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}