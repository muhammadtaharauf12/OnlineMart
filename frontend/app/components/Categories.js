
import Link from "next/link";

const categories = [
  {
    name: "Fresh Fruits",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500",
  },
  {
    name: "Vegetables",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500",
  },
  {
    name: "Dairy Products",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500",
  },
  {
    name: "Bakery",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500",
  },
  {
    name: "Beverages",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500",
  },
  {
  name: "Snacks",
  image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500",
},
];

export default function Categories() {
  return (
   <section className="bg-[#faf7ed]">

     <div className="mx-auto max-w-[1344px] px-5 md:px-0">

        {/* Section Heading */}
        <div className="flex justify-between items-center mb-8">

          <div>
            <p className="text-green-700 font-semibold text-sm">
              OUR CATEGORIES
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              Shop by Category
            </h2>

            <p className="text-gray-500 mt-2">
              Explore our wide range of fresh grocery products.
            </p>
          </div>

          <Link
            href="/categories"
            className="text-green-700 font-semibold hover:text-green-900"
          >
            View All →
          </Link>

        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">

          {categories.map((category) => (
            <Link
              href="/categories"
              key={category.name}
              className="group border border-gray-100 rounded-xl p-3 text-center hover:shadow-lg hover:border-green-200 transition"
            >

              <div
                role="img"
                aria-label={category.name}
                className="h-32 w-full rounded-lg bg-cover bg-center group-hover:scale-105 transition duration-300"
                style={{
                  backgroundImage: `url(${category.image})`,
                }}
              />

              <h3 className="font-semibold text-gray-800 mt-4 mb-2">
                {category.name}
              </h3>

              <p className="text-xs text-green-700">
                Explore Products
              </p>

            </Link>
          ))}

        </div>

      </div>

    </section>
  );
}
