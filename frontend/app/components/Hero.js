import Link from "next/link";
import Image from "next/image";
import { Sparkle, Clock, Heart, Check } from "lucide-react";

const benefits = [
  { icon: Sparkle, title: "Picked fresh daily" },
  { icon: Clock, title: "Same-day delivery" },
  { icon: Heart, title: "Quality guaranteed" },
  { icon: Check, title: "Easy returns" },
];

export default function Hero() {
  return (
   <section className="bg-[#faf7ed] pt-7">
      <div className="mx-auto max-w-[1344px] px-5 md:px-0">

        {/* Hero Banner */}
        <div className="grid min-h-[360px] grid-cols-1 overflow-hidden rounded-[24px] bg-[#e8f5e8] md:grid-cols-[612px_1fr]">

          {/* Left Content */}
          <div className="px-7 py-10 md:py-[42px] md:pl-11 md:pr-5">
            <span className="inline-flex h-[40px] items-center justify-center rounded-[20px] bg-white px-5 text-[13px] font-semibold text-[#175738]">
              FRESH EVERY DAY
            </span>

            <h1 className="mt-5 text-[40px] font-bold leading-[1.15] text-[#175738] md:text-[52px]">
              Fresh food,
              <br />
              happier you.
            </h1>

            <p className="mt-4 text-[16px] leading-6 text-[#6b786e]">
              Farm-fresh produce and everyday essentials,
              <br className="hidden md:block" />
              carefully picked and delivered to your home.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-[22px]">
              <Link
                href="/products"
                className="inline-flex h-[48px] w-[164px] items-center justify-center rounded-[12px] bg-[#175738] text-[14px] font-semibold !text-white transition hover:bg-[#10452b]"
              >
                Shop groceries&nbsp; →
              </Link>

              <span className="text-[13px] font-medium text-[#175738]">
                Quality you can taste. Prices you’ll love.
              </span>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative min-h-[280px] bg-[#f5f2e3] md:min-h-[360px]">
            <Image
              src="/hero.png"
              alt="Fresh groceries in a basket"
              fill
              priority
              sizes="(min-width: 768px) 732px, 100vw"
              className="rounded-[24px] object-cover"
            />
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-[35px] grid grid-cols-2 gap-5 px-3 md:px-[52px] lg:grid-cols-4 lg:gap-0">
          {benefits.map(({ icon: Icon, title }) => (
            <div key={title} className="flex items-center gap-[14px]">
              <div className="flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-[14px] bg-white">
                <Icon size={20} strokeWidth={2.5} className="text-[#175738]" />
              </div>

              <p className="text-[15px] font-semibold text-[#1a241c]">
                {title}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}