"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Asterisk, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        {
          email,
          password,
        }
      );

      const token = response.data.token;

      if (!token) {
        alert("Login token not received!");
        return;
      }

      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("auth-change"));

      alert("Login successful!");

      router.push("/");
    } catch (error) {
      console.log("Login Error:", error);

      alert(
        error.response?.data?.message || "Invalid email or password!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: yahan Google login ka logic lagao
    alert("Google login is coming soon!");
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#faf7ed] px-5 py-12">
      <div className="mx-auto w-full max-w-[660px] rounded-[24px] bg-white px-6 py-12 shadow-sm md:px-[130px] md:py-14">

        {/* Brand mark */}
        <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[12px] bg-[#1fa83a]">
          <Asterisk size={26} strokeWidth={3} className="text-white" />
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-[30px] font-bold leading-tight text-[#1a241c]">
          Welcome back!
        </h1>

        <p className="mt-2 text-[14px] text-[#6b786e]">
          Sign in to continue shopping fresh.
        </p>

        <form onSubmit={handleLogin} className="mt-8">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-[13px] font-semibold text-[#1a241c]"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-[52px] w-full rounded-[12px] border border-[#e3e8e0] bg-[#faf7ed] px-4 text-[14px] text-[#1a241c] outline-none transition placeholder:text-[#6b786e] focus:border-[#175738] focus:ring-2 focus:ring-[#175738]/10"
            />
          </div>

          {/* Password */}
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-[13px] font-semibold text-[#1a241c]"
              >
                Password
              </label>

              <Link
                href="/forgot-password"
                className="text-[13px] font-semibold text-[#175738] hover:text-[#fa8f38]"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-[52px] w-full rounded-[12px] border border-[#e3e8e0] bg-[#faf7ed] pl-4 pr-12 text-[14px] text-[#1a241c] outline-none transition placeholder:text-[#6b786e] focus:border-[#175738] focus:ring-2 focus:ring-[#175738]/10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b786e] hover:text-[#175738]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Sign in */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 h-[46px] w-full rounded-[12px] bg-[#175738] text-[14px] font-semibold text-white transition hover:bg-[#10452b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-4">
          <span className="h-px flex-1 bg-[#e3e8e0]" />
          <span className="text-[12px] text-[#6b786e]">OR</span>
          <span className="h-px flex-1 bg-[#e3e8e0]" />
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex h-[50px] w-full items-center justify-center gap-3 rounded-[12px] border border-[#e3e8e0] bg-white text-[14px] font-semibold text-[#1a241c] transition hover:bg-[#faf7ed]"
        >
          <span className="text-[16px] font-bold text-[#4285F4]">G</span>
          Continue with Google
        </button>

        {/* Sign up */}
        <p className="mt-6 text-center text-[13px] text-[#6b786e]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#175738] hover:text-[#fa8f38]"
          >
            Create one
          </Link>
        </p>

      </div>
    </section>
  );
}