import { Inter } from "next/font/google";
import "./globals.css";
import LayoutShell from "./components/LayoutShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "FreshMart | Good food. Good mood.",
  description:
    "Farm-fresh produce and everyday essentials, carefully picked and delivered to your home in Karachi.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body
        className={`${inter.className} min-h-full flex flex-col bg-[#faf7ed] text-[#1a241c]`}
      >
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}