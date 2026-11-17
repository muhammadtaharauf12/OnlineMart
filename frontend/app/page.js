import Hero from "./components/Hero";
import Categories from "./components/Categories";
import FeaturedProducts from "./components/FeaturedProducts";
import WhyChooseUs from "./components/WhyChooseUs";

export default function Home() {
  return (
    <div className="flex flex-col gap-14 pb-14">
      <Hero />
      <Categories />
      <FeaturedProducts />
      <WhyChooseUs />
    </div>
  );
}