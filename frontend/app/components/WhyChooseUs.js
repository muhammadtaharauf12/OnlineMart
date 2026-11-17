
import { Truck, ShieldCheck, Headphones, Leaf } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Get your groceries delivered to your doorstep.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Shopping",
    description: "Your information and orders are safe with us.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our team is always ready to help you.",
  },
  {
    icon: Leaf,
    title: "Fresh Products",
    description: "We provide fresh and quality grocery products.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-10">
          <p className="text-green-700 font-semibold text-sm">
            WHY ONLINE MART
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            Why Choose Us?
          </h2>

          <p className="text-gray-500 mt-3">
            We make your grocery shopping simple and convenient.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="text-center p-6 rounded-xl bg-green-50 hover:shadow-md transition"
              >
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <Icon size={30} className="text-green-700" />
                </div>

                <h3 className="font-bold text-lg mt-4">
                  {benefit.title}
                </h3>

                <p className="text-gray-500 text-sm mt-2 leading-6">
                  {benefit.description}
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
