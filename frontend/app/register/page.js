
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBasket } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        "http://https://fearless-simplicity-production-ab636cfe.up.railway.app/api/v1/auth/register",
        {
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
        }
      );

      alert("Registration successful! Please login.");
      router.push("/login");

    } catch (error) {
      console.log("Register Error:", error);
      alert(
        error.response?.data?.message ||
        "Unable to register. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

        <div className="flex justify-center mb-5">
          <div className="bg-green-100 p-4 rounded-full">
            <ShoppingBasket size={35} className="text-green-700" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Join OnlineMart today!
        </p>

        <form onSubmit={handleRegister} className="mt-8">

          <div className="grid grid-cols-2 gap-4 mb-5">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-3"
            />

            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-3"
            />
          </div>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-3 mb-5"
          />

          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full border rounded-lg px-4 py-3 mb-6"
          />
          <input
  type="password"
  placeholder="Confirm Password"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
  required
  className="w-full border rounded-lg px-4 py-3 mb-6"
/>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 disabled:bg-gray-400"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-green-700 font-semibold">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
